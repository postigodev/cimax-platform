import React, { useEffect, useMemo, useState } from "react";
import { ClipboardPlus, Fingerprint, Save, ScanLine } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const initialOrder = {
  nombres: "",
  apellidos: "",
  edad: "",
  boleta: "",
  comentario: "",
  monto: "",
  doctor: "",
  toma: [],
  cd_quemado: false,
  enviado: false,
  usb: false,
  tomo_impresa: false,
};

function ToggleField({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background p-3">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export const PostOrden = () => {
  const [order, setOrder] = useState(initialOrder);
  const [tomaTypes, setTomaTypes] = useState([]);
  const [doctorNames, setDoctorNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  const selectedStudyNames = useMemo(
    () =>
      tomaTypes
        .filter((item) => order.toma.includes(item._id))
        .map((item) => item.nombre),
    [order.toma, tomaTypes],
  );

  const updateOrder = (field, value) => {
    setOrder((current) => ({ ...current, [field]: value }));
  };

  const toggleStudyType = (id) => {
    setOrder((current) => {
      const exists = current.toma.includes(id);
      return {
        ...current,
        toma: exists
          ? current.toma.filter((selectedId) => selectedId !== id)
          : [...current.toma, id],
      };
    });
  };

  const reset = () => setOrder(initialOrder);

  const submitOrden = async (event) => {
    event.preventDefault();

    const toastId = toast.loading(t("common.saving"));

    try {
      await api.post(
        "/ordenes/create-orden",
        {
          ...order,
          edad: order.edad === "" ? undefined : Number(order.edad),
          monto: order.monto === "" ? undefined : Number(order.monto),
        },
        {
          headers: {
            "Idempotency-Key": `web-order-${Date.now()}`,
          },
        },
      );

      reset();
      toast.success(t("common.savedOrder"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [tomasResponse, doctorsResponse] = await Promise.all([
          api.get("/doctores/tomas"),
          api.get("/doctores/all"),
        ]);

        setTomaTypes(tomasResponse.data.tomas);
        setDoctorNames(doctorsResponse.data.doctores);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={t("order.eyebrow")}
        title={t("order.title")}
        description={t("order.description")}
        badge={t("order.idempotency")}
      />
      <form className="grid gap-4 p-8 xl:grid-cols-[1.1fr_0.9fr]" onSubmit={submitOrden}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardPlus />
              {t("order.patient")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombres">{t("order.names")}</Label>
              <Input
                id="nombres"
                value={order.nombres}
                onChange={(event) => updateOrder("nombres", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="apellidos">{t("order.surnames")}</Label>
              <Input
                id="apellidos"
                value={order.apellidos}
                onChange={(event) => updateOrder("apellidos", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edad">{t("order.age")}</Label>
              <Input
                id="edad"
                type="number"
                min="0"
                value={order.edad}
                onChange={(event) => updateOrder("edad", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="boleta">{t("order.ticket")}</Label>
              <Input
                id="boleta"
                value={order.boleta}
                onChange={(event) => updateOrder("boleta", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="monto">{t("order.amount")}</Label>
              <Input
                id="monto"
                type="number"
                min="0"
                value={order.monto}
                onChange={(event) => updateOrder("monto", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
              <Label htmlFor="comentario">{t("order.comment")}</Label>
              <Textarea
                id="comentario"
                value={order.comentario}
                onChange={(event) => updateOrder("comentario", event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine />
              {t("order.fulfillment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("order.doctor")}</Label>
              <Select
                value={order.doctor}
                onValueChange={(value) => updateOrder("doctor", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={loading ? "Loading..." : t("order.selectDoctor")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {doctorNames.map(({ nombres, apellidos, _id }) => (
                    <SelectItem key={_id} value={_id}>
                      {nombres} {apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!loading && doctorNames.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("order.noDoctors")}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t("order.studyTypes")}</Label>
              <div className="flex flex-wrap gap-2 rounded-md border bg-background p-3">
                {tomaTypes.map(({ nombre, _id }) => {
                  const selected = order.toma.includes(_id);
                  return (
                    <Button
                      key={_id}
                      type="button"
                      size="sm"
                      variant={selected ? "default" : "outline"}
                      aria-pressed={selected}
                      onClick={() => toggleStudyType(_id)}
                    >
                      {nombre}
                    </Button>
                  );
                })}
                {!loading && tomaTypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("order.noStudies")}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedStudyNames.length > 0 ? (
                  selectedStudyNames.map((name) => (
                    <Badge key={name} variant="secondary">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">{t("order.selectStudy")}</Badge>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleField
                id="cd_quemado"
                label={t("order.cdBurned")}
                checked={order.cd_quemado}
                onCheckedChange={(value) => updateOrder("cd_quemado", value)}
              />
              <ToggleField
                id="enviado"
                label={t("order.sent")}
                checked={order.enviado}
                onCheckedChange={(value) => updateOrder("enviado", value)}
              />
              <ToggleField
                id="usb"
                label="USB"
                checked={order.usb}
                onCheckedChange={(value) => updateOrder("usb", value)}
              />
              <ToggleField
                id="tomo_impresa"
                label={t("order.printedScan")}
                checked={order.tomo_impresa}
                onCheckedChange={(value) => updateOrder("tomo_impresa", value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
              <div>
                <p className="text-sm font-medium">Idempotency-Key</p>
                <p className="text-xs text-muted-foreground">{t("order.idempotency")}</p>
              </div>
              <Fingerprint />
            </div>

            <Button type="submit">
              <Save data-icon="inline-start" />
              {t("common.save")}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

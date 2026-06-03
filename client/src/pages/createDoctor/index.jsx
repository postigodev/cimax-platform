import React, { useState } from "react";
import { BadgePercent, Save, Stethoscope } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const initialDoctor = {
  nombres: "",
  apellidos: "",
  convenio: false,
  descuento: false,
  monto: "",
};

function RuleSwitch({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background p-3">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export const CreateDoctor = () => {
  const [doctor, setDoctor] = useState(initialDoctor);
  const { t } = useI18n();

  const updateDoctor = (field, value) => {
    setDoctor((current) => ({ ...current, [field]: value }));
  };

  const submitDoctor = async (event) => {
    event.preventDefault();
    const toastId = toast.loading(t("common.saving"));

    try {
      await api.post("/doctores/create-doctor", {
        nombres: doctor.nombres,
        apellidos: doctor.apellidos,
        convenio: doctor.convenio,
        descuento: doctor.descuento,
        monto_descuento: doctor.monto === "" ? undefined : Number(doctor.monto),
      });

      setDoctor(initialDoctor);
      toast.success(t("common.savedDoctor"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("doctor.eyebrow")}
        title={t("doctor.title")}
        description={t("doctor.description")}
        badge={t("nav.doctors")}
      />
      <form className="grid gap-4 p-8 xl:grid-cols-[0.9fr_1.1fr]" onSubmit={submitDoctor}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope />
              {t("doctor.identity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-nombres">{t("doctor.firstNames")}</Label>
              <Input
                id="doctor-nombres"
                value={doctor.nombres}
                onChange={(event) => updateDoctor("nombres", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-apellidos">{t("doctor.lastNames")}</Label>
              <Input
                id="doctor-apellidos"
                value={doctor.apellidos}
                onChange={(event) => updateDoctor("apellidos", event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgePercent />
              {t("doctor.businessRules")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <RuleSwitch
                id="doctor-convenio"
                label={t("doctor.agreement")}
                checked={doctor.convenio}
                onCheckedChange={(value) => updateDoctor("convenio", value)}
              />
              <RuleSwitch
                id="doctor-descuento"
                label={t("doctor.discount")}
                checked={doctor.descuento}
                onCheckedChange={(value) => updateDoctor("descuento", value)}
              />
            </div>
            {doctor.descuento ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="doctor-monto">{t("doctor.discountAmount")}</Label>
                <Input
                  id="doctor-monto"
                  type="number"
                  min="0"
                  value={doctor.monto}
                  onChange={(event) => updateDoctor("monto", event.target.value)}
                />
              </div>
            ) : null}
            <Button type="submit" className="w-fit">
              <Save data-icon="inline-start" />
              {t("common.save")}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

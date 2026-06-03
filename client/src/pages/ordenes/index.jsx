import React, { useEffect, useMemo, useState } from "react";
import { Filter, Palette, Pencil, Save, Search, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const todayInput = () => new Date().toISOString().slice(0, 10);

const tomorrowInput = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
};

const inputDateToApi = (value) => {
  const [year, month, day] = value.split("-");
  return `${Number(month)}-${Number(day)}-${year}`;
};

const formatOrderDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

const getDoctorName = (doctor) =>
  doctor ? `${doctor.nombres} ${doctor.apellidos}`.trim() : "-";

const getTicket = (order, fallback) => order.boletaa || order.boleta || fallback;

function FlagBadge({ value }) {
  const { t } = useI18n();
  return (
    <Badge variant={value ? "secondary" : "outline"}>
      {value ? t("common.yes") : t("common.no")}
    </Badge>
  );
}

function OrderSwitch({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background p-3">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function OrderEditDialog({ order, open, onOpenChange, doctors, studies, onSave }) {
  const [draft, setDraft] = useState(null);
  const { t } = useI18n();

  useEffect(() => {
    if (order) {
      setDraft({
        nombres: order.nombres || "",
        apellidos: order.apellidos || "",
        edad: order.edad ?? "",
        doctor: order.doctor?._id || "",
        toma: (order.toma || []).map((study) => study._id),
        cd_quemado: Boolean(order.cd_quemado),
        enviado: Boolean(order.enviado),
        usb: Boolean(order.usb),
        tomo_impresa: Boolean(order.tomo_impresa),
        boleta: order.boletaa || order.boleta || "",
        comentario: order.comentario || "",
        monto: order.monto ?? "",
      });
    }
  }, [order]);

  if (!order || !draft) return null;

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleStudy = (id) => {
    setDraft((current) => {
      const selected = current.toma.includes(id);
      return {
        ...current,
        toma: selected
          ? current.toma.filter((selectedId) => selectedId !== id)
          : [...current.toma, id],
      };
    });
  };

  const submit = (event) => {
    event.preventDefault();
    onSave(order._id, draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("order.edit")}</DialogTitle>
          <DialogDescription>{t("order.editDescription")}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" id="edit-order-form" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-order-nombres">{t("order.names")}</Label>
              <Input
                id="edit-order-nombres"
                value={draft.nombres}
                onChange={(event) => updateDraft("nombres", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-order-apellidos">{t("order.surnames")}</Label>
              <Input
                id="edit-order-apellidos"
                value={draft.apellidos}
                onChange={(event) => updateDraft("apellidos", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-order-edad">{t("order.age")}</Label>
              <Input
                id="edit-order-edad"
                type="number"
                min="0"
                value={draft.edad}
                onChange={(event) => updateDraft("edad", event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>{t("order.doctor")}</Label>
              <Select
                value={draft.doctor}
                onValueChange={(value) => updateDraft("doctor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("order.selectDoctor")} />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {getDoctorName(doctor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("order.studyTypes")}</Label>
              <div className="flex min-h-10 flex-wrap gap-2 rounded-md border bg-background p-2">
                {studies.map((study) => {
                  const selected = draft.toma.includes(study._id);
                  return (
                    <Button
                      key={study._id}
                      type="button"
                      size="sm"
                      variant={selected ? "default" : "outline"}
                      onClick={() => toggleStudy(study._id)}
                    >
                      {study.nombre}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <OrderSwitch
              id="edit-cd"
              label={t("order.cdBurned")}
              checked={draft.cd_quemado}
              onCheckedChange={(value) => updateDraft("cd_quemado", value)}
            />
            <OrderSwitch
              id="edit-sent"
              label={t("order.sent")}
              checked={draft.enviado}
              onCheckedChange={(value) => updateDraft("enviado", value)}
            />
            <OrderSwitch
              id="edit-usb"
              label="USB"
              checked={draft.usb}
              onCheckedChange={(value) => updateDraft("usb", value)}
            />
            <OrderSwitch
              id="edit-printed"
              label={t("order.printedScan")}
              checked={draft.tomo_impresa}
              onCheckedChange={(value) => updateDraft("tomo_impresa", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-order-boleta">{t("order.ticket")}</Label>
              <Input
                id="edit-order-boleta"
                value={draft.boleta}
                onChange={(event) => updateDraft("boleta", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-order-monto">{t("order.amount")}</Label>
              <Input
                id="edit-order-monto"
                type="number"
                min="0"
                value={draft.monto}
                onChange={(event) => updateDraft("monto", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
              <Label htmlFor="edit-order-comment">{t("order.comment")}</Label>
              <Textarea
                id="edit-order-comment"
                value={draft.comentario}
                onChange={(event) => updateDraft("comentario", event.target.value)}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("doctor.cancel")}
          </Button>
          <Button type="submit" form="edit-order-form">
            <Save data-icon="inline-start" />
            {t("order.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarkerDialog({ order, open, onOpenChange, onChoose }) {
  const { t } = useI18n();
  if (!order) return null;

  const options = [
    { label: t("order.markerBlue"), value: "cyan" },
    { label: t("order.markerGreen"), value: "#00a000" },
    { label: t("order.markerNone"), value: "#fff" },
    { label: t("order.markerComment"), value: "comentario" },
    { label: t("order.markerDoctor"), value: "doctor" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("order.rowMarker")}</DialogTitle>
          <DialogDescription>{t("order.markerDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              onClick={() => onChoose(order._id, option.value)}
            >
              <Palette data-icon="inline-start" />
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulkDeleteDialog({ open, onOpenChange, count, onConfirm }) {
  const [password, setPassword] = useState("");
  const { t } = useI18n();

  const submit = (event) => {
    event.preventDefault();
    onConfirm(password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("order.bulkDeleteTitle")}</DialogTitle>
          <DialogDescription>{t("order.bulkDeleteDescription")}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" id="bulk-delete-form" onSubmit={submit}>
          <Badge variant="outline">{t("order.selected", { count })}</Badge>
          <div className="flex flex-col gap-2">
            <Label htmlFor="delete-password">{t("order.password")}</Label>
            <Input
              id="delete-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("doctor.cancel")}
          </Button>
          <Button type="submit" variant="destructive" form="bulk-delete-form">
            <Trash2 data-icon="inline-start" />
            {t("order.bulkDelete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Ordenes = () => {
  const [filters, setFilters] = useState({
    sort: "all",
    secondary: "",
    tertiary: "",
    cuaternary: "",
    start: todayInput(),
    end: tomorrowInput(),
  });
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [studies, setStudies] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [markerOrder, setMarkerOrder] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const { t } = useI18n();

  const visibleOrders = useMemo(() => [...orders].reverse(), [orders]);
  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const dateRange = () => `${inputDateToApi(filters.start)}/${inputDateToApi(filters.end)}`;

  const buildFilterEndpoint = () => {
    const range = dateRange();

    switch (filters.sort) {
      case "doctor":
        return `get-by-doctor/${filters.secondary}/${range}`;
      case "study":
        return `get-by-toma/${filters.secondary}/${range}`;
      case "doctor-study":
        return `get-by-doctor-toma/${filters.cuaternary}/${filters.secondary}/${range}`;
      case "usb":
        return `get-by-usb/${range}`;
      case "color":
        return `get-by-color/${range}`;
      case "patient":
        return `get-by-paciente/${filters.tertiary}`;
      case "ticket":
        return `get-by-boleta/${filters.tertiary}`;
      default:
        return `get-all/${range}`;
    }
  };

  const loadOrders = async (endpoint = `get-all/${dateRange()}`) => {
    const { data } = await api.get(`/ordenes/${endpoint}`);
    setOrders(data.ordenes);
    setSelectedIds([]);
  };

  const submitFilter = async () => {
    const toastId = toast.loading(t("common.saving"));

    try {
      await loadOrders(buildFilterEndpoint());
      toast.dismiss(toastId);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  const toggleSelected = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleAll = (checked) => {
    setSelectedIds(checked ? orders.map((order) => order._id) : []);
  };

  const editOrder = async (id, draft) => {
    const toastId = toast.loading(t("common.saving"));

    try {
      const { data } = await api.put(`/ordenes/edit-orden/${id}`, {
        usb: draft.usb,
        monto: draft.monto === "" ? undefined : Number(draft.monto),
        cd_quemado: draft.cd_quemado,
        tomo_impresa: draft.tomo_impresa,
        nombres: draft.nombres,
        apellidos: draft.apellidos,
        boleta: draft.boleta,
        doctor: draft.doctor,
        toma: draft.toma,
        enviado: draft.enviado,
        edad: draft.edad === "" ? undefined : Number(draft.edad),
        comentario: draft.comentario,
      });

      setOrders((current) =>
        current.map((order) => (order._id === id ? data.orden : order)),
      );
      setEditingOrder(null);
      toast.success(t("order.edited"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  const applyMarker = async (id, color) => {
    const toastId = toast.loading(t("common.saving"));
    let endpoint = `/ordenes/edit-color/${id}`;

    if (color === "doctor") {
      endpoint = `/ordenes/edit-doctor-color/${id}`;
    } else if (color === "comentario") {
      endpoint = `/ordenes/edit-comment-color/${id}`;
    }

    try {
      const { data } = await api.put(endpoint, { color });
      setOrders((current) =>
        current.map((order) => (order._id === id ? data.orden : order)),
      );
      setMarkerOrder(null);
      toast.dismiss(toastId);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  const bulkDelete = async (password) => {
    const toastId = toast.loading(t("common.saving"));

    try {
      await api.delete("/ordenes/delete-orden/", {
        data: {
          ids: selectedIds,
          password,
        },
      });
      setOrders((current) => current.filter((order) => !selectedIds.includes(order._id)));
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      toast.success(t("order.deleted"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [doctorsResponse, studiesResponse] = await Promise.all([
        api.get("/doctores/all"),
        api.get("/doctores/tomas"),
      ]);

      setDoctors(doctorsResponse.data.doctores);
      setStudies(studiesResponse.data.tomas);
      await loadOrders();
    };

    loadInitialData();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={t("order.eyebrow")}
        title={t("order.tableTitle")}
        description={t("order.tableDescription")}
        badge={`${orders.length} ${t("nav.orders").toLowerCase()}`}
      />
      <section className="grid gap-4 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter />
              {t("order.filters")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 xl:grid-cols-[repeat(6,minmax(0,1fr))]">
            <div className="flex flex-col gap-2">
              <Label>{t("order.startDate")}</Label>
              <Input
                type="date"
                value={filters.start}
                onChange={(event) => updateFilter("start", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("order.endDate")}</Label>
              <Input
                type="date"
                value={filters.end}
                onChange={(event) => updateFilter("end", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("order.filterBy")}</Label>
              <Select
                value={filters.sort}
                onValueChange={(value) => updateFilter("sort", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.none")}</SelectItem>
                  <SelectItem value="doctor">{t("order.doctor")}</SelectItem>
                  <SelectItem value="study">{t("order.studyTypes")}</SelectItem>
                  <SelectItem value="doctor-study">{t("order.doctorAndStudy")}</SelectItem>
                  <SelectItem value="usb">USB</SelectItem>
                  <SelectItem value="color">{t("order.color")}</SelectItem>
                  <SelectItem value="patient">{t("order.patient")}</SelectItem>
                  <SelectItem value="ticket">{t("order.ticket")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filters.sort === "doctor-study" ? (
              <div className="flex flex-col gap-2">
                <Label>{t("order.doctor")}</Label>
                <Select
                  value={filters.cuaternary}
                  onValueChange={(value) => updateFilter("cuaternary", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("order.selectDoctor")} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {getDoctorName(doctor)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {["doctor", "study", "doctor-study"].includes(filters.sort) ? (
              <div className="flex flex-col gap-2">
                <Label>
                  {filters.sort === "doctor" ? t("order.doctor") : t("order.studyTypes")}
                </Label>
                <Select
                  value={filters.secondary}
                  onValueChange={(value) => updateFilter("secondary", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(filters.sort === "doctor" ? doctors : studies).map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.nombre || getDoctorName(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {["patient", "ticket"].includes(filters.sort) ? (
              <div className="flex flex-col gap-2">
                <Label>
                  {filters.sort === "patient"
                    ? t("order.patientSearch")
                    : t("order.ticketSearch")}
                </Label>
                <Input
                  value={filters.tertiary}
                  onChange={(event) => updateFilter("tertiary", event.target.value)}
                />
              </div>
            ) : null}
            <div className="flex items-end gap-2">
              <Button type="button" onClick={submitFilter}>
                <Search data-icon="inline-start" />
                {t("order.applyFilter")}
              </Button>
              {selectedIds.length > 0 ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  <Trash2 data-icon="inline-start" />
                  {selectedIds.length}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{t("order.date")}</TableHead>
                  <TableHead>{t("order.names")}</TableHead>
                  <TableHead>{t("order.surnames")}</TableHead>
                  <TableHead>{t("order.age")}</TableHead>
                  <TableHead>{t("order.doctor")}</TableHead>
                  <TableHead>{t("order.studyTypes")}</TableHead>
                  <TableHead>{t("order.cdBurned")}</TableHead>
                  <TableHead>{t("order.sent")}</TableHead>
                  <TableHead>USB</TableHead>
                  <TableHead>{t("order.printedScan")}</TableHead>
                  <TableHead>{t("order.ticket")}</TableHead>
                  <TableHead>{t("order.comment")}</TableHead>
                  <TableHead>{t("order.amount")}</TableHead>
                  <TableHead className="text-right">{t("doctor.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.map((order, index) => {
                  const selected = selectedIds.includes(order._id);
                  return (
                    <TableRow
                      key={order._id}
                      data-state={selected ? "selected" : undefined}
                      style={{ background: order.color || undefined }}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        setMarkerOrder(order);
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleSelected(order._id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                      <TableCell>{formatOrderDate(order.date)}</TableCell>
                      <TableCell className="font-medium">{order.nombres}</TableCell>
                      <TableCell>{order.apellidos}</TableCell>
                      <TableCell>{order.edad}</TableCell>
                      <TableCell
                        style={{
                          background: order.doctor_color ? "orange" : undefined,
                        }}
                      >
                        {getDoctorName(order.doctor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {(order.toma || []).map((study) => (
                            <span key={study._id || study.nombre}>{study.nombre}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <FlagBadge value={order.cd_quemado} />
                      </TableCell>
                      <TableCell>
                        <FlagBadge value={order.enviado} />
                      </TableCell>
                      <TableCell>
                        <FlagBadge value={order.usb} />
                      </TableCell>
                      <TableCell>
                        <FlagBadge value={order.tomo_impresa} />
                      </TableCell>
                      <TableCell>{getTicket(order, t("order.paidAtClinic"))}</TableCell>
                      <TableCell
                        style={{
                          background: order.comment_color ? "#fbff93" : undefined,
                        }}
                      >
                        {order.comentario || "N/A"}
                      </TableCell>
                      <TableCell>{order.monto}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("order.edit")}
                            onClick={() => setEditingOrder(order)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("order.rowMarker")}
                            onClick={() => setMarkerOrder(order)}
                          >
                            <Palette />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <OrderEditDialog
        order={editingOrder}
        open={Boolean(editingOrder)}
        onOpenChange={(open) => {
          if (!open) setEditingOrder(null);
        }}
        doctors={doctors}
        studies={studies}
        onSave={editOrder}
      />
      <MarkerDialog
        order={markerOrder}
        open={Boolean(markerOrder)}
        onOpenChange={(open) => {
          if (!open) setMarkerOrder(null);
        }}
        onChoose={applyMarker}
      />
      <BulkDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        count={selectedIds.length}
        onConfirm={bulkDelete}
      />
    </div>
  );
};

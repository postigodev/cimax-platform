import React, { useEffect, useState } from "react";
import { Pencil, Save, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../api";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getDoctorName = (doctor) => `${doctor.nombres} ${doctor.apellidos}`.trim();

function DoctorRule({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background p-3">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function DoctorFormDialog({ doctor, open, onOpenChange, onSave }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (doctor) {
      setDraft({
        nombres: doctor.nombres || "",
        apellidos: doctor.apellidos || "",
        convenio: Boolean(doctor.convenio),
        descuento: Boolean(doctor.descuento),
        monto: doctor.monto_descuento ?? "",
      });
    }
  }, [doctor]);

  if (!doctor || !draft) return null;

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSave(doctor._id, draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("doctor.edit")}</DialogTitle>
          <DialogDescription>{t("doctor.editDescription")}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" id="edit-doctor-form" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-nombres">{t("doctor.firstNames")}</Label>
              <Input
                id="edit-nombres"
                value={draft.nombres}
                onChange={(event) => updateDraft("nombres", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-apellidos">{t("doctor.lastNames")}</Label>
              <Input
                id="edit-apellidos"
                value={draft.apellidos}
                onChange={(event) => updateDraft("apellidos", event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DoctorRule
              id="edit-convenio"
              label={t("doctor.agreement")}
              checked={draft.convenio}
              onCheckedChange={(value) => updateDraft("convenio", value)}
            />
            <DoctorRule
              id="edit-descuento"
              label={t("doctor.discount")}
              checked={draft.descuento}
              onCheckedChange={(value) => updateDraft("descuento", value)}
            />
          </div>
          {draft.descuento ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-monto">{t("doctor.discountAmount")}</Label>
              <Input
                id="edit-monto"
                type="number"
                min="0"
                value={draft.monto}
                onChange={(event) => updateDraft("monto", event.target.value)}
              />
            </div>
          ) : null}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("doctor.cancel")}
          </Button>
          <Button type="submit" form="edit-doctor-form">
            <Save data-icon="inline-start" />
            {t("doctor.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDoctorDialog({ doctor, open, onOpenChange, onConfirm }) {
  const { t } = useI18n();
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("doctor.deleteQuestion", { doctor: getDoctorName(doctor) })}
          </DialogTitle>
          <DialogDescription>{t("doctor.deleteDescription")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("doctor.cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={() => onConfirm(doctor._id)}>
            <Trash2 data-icon="inline-start" />
            {t("doctor.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Doctores = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const { t } = useI18n();

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await api.get("/doctores/all");
      setDoctors(data.doctores);
    };

    fetchDoctors();
  }, []);

  const editDoctor = async (id, draft) => {
    const toastId = toast.loading(t("common.saving"));

    try {
      const { data } = await api.put(`/doctores/edit-doctor/${id}`, {
        nombres: draft.nombres,
        apellidos: draft.apellidos,
        monto: draft.monto === "" ? undefined : Number(draft.monto),
        descuento: draft.descuento,
        convenio: draft.convenio,
      });

      setDoctors((current) =>
        current.map((doctor) => (doctor._id === id ? data.doctor : doctor)),
      );
      setEditingDoctor(null);
      toast.success(t("doctor.edited"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  const deleteDoctor = async (id) => {
    const toastId = toast.loading(t("common.saving"));

    try {
      await api.delete(`/doctores/delete-doctor/${id}`);
      setDoctors((current) => current.filter((doctor) => doctor._id !== id));
      setDeletingDoctor(null);
      toast.success(t("doctor.deleted"), { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { id: toastId });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("doctor.eyebrow")}
        title={t("doctor.tableTitle")}
        description={t("doctor.tableDescription")}
        badge={`${doctors.length} ${t("nav.doctors").toLowerCase()}`}
      />
      <section className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope />
              {t("nav.doctors")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("doctor.firstNames")}</TableHead>
                  <TableHead>{t("doctor.lastNames")}</TableHead>
                  <TableHead>{t("doctor.agreement")}</TableHead>
                  <TableHead>{t("doctor.discount")}</TableHead>
                  <TableHead>{t("doctor.discountAmount")}</TableHead>
                  <TableHead className="text-right">{t("doctor.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell className="font-medium">{doctor.nombres}</TableCell>
                    <TableCell>{doctor.apellidos}</TableCell>
                    <TableCell>
                      <Badge variant={doctor.convenio ? "secondary" : "outline"}>
                        {doctor.convenio ? t("common.yes") : t("common.no")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doctor.descuento ? "secondary" : "outline"}>
                        {doctor.descuento ? t("common.yes") : t("common.no")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doctor.descuento ? doctor.monto_descuento : t("common.none")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={t("doctor.edit")}
                          onClick={() => setEditingDoctor(doctor)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={t("doctor.delete")}
                          onClick={() => setDeletingDoctor(doctor)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <DoctorFormDialog
        doctor={editingDoctor}
        open={Boolean(editingDoctor)}
        onOpenChange={(open) => {
          if (!open) setEditingDoctor(null);
        }}
        onSave={editDoctor}
      />
      <DeleteDoctorDialog
        doctor={deletingDoctor}
        open={Boolean(deletingDoctor)}
        onOpenChange={(open) => {
          if (!open) setDeletingDoctor(null);
        }}
        onConfirm={deleteDoctor}
      />
    </div>
  );
};

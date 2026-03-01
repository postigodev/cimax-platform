import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import EditForm from "./EditForm";
import { CONFIG } from "../../config";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditButton({ id, doctors, getDoctor }) {
  const [open, setOpen] = useState(false);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [convenio, setConvenio] = useState(false);
  const [descuento, setDescuento] = useState(false);
  const [monto, setMonto] = useState(0);

  const reset = () => {
    setConvenio(false);
    setDescuento(false);
  };

  const handleNombres = (e) => {
    setNombres(e.target.value);
  };

  const handleApellidos = (e) => {
    setApellidos(e.target.value);
  };

  const handleConvenio = (e) => {
    setConvenio(!convenio);
  };

  const handleDescuento = (e) => {
    setDescuento(!descuento);
  };

  const handleMonto = (e) => {
    setMonto(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const acceptEdit = () => {
    setOpen(false);
    editDoctor();
  };

  const editDoctor = async () => {
    try {
      toast.loading();
      const { data } = await axios({
        method: "PUT",
        url: `${CONFIG.DOMAIN}/doctores/edit-doctor/${id}`,
        data: {
          nombres,
          apellidos,
          monto,
          descuento,
          convenio
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const doctorToReplace = doctors.map((d) => {
        if (d._id === id) return data.doctor;
        return d;
      });
      getDoctor(doctorToReplace);
      reset();
      toast.dismiss();
      return toast.success("Doctor editado con éxito");
    } catch (e) {
      toast.dismiss();
      return toast.error(e.response.data.message);
    }
  };

  return (
    <div>
      <EditForm
        open={open}
        handleClose={handleClose}
        handleApellidos={handleApellidos}
        handleNombres={handleNombres}
        handleConvenio={handleConvenio}
        handleDescuento={handleDescuento}
        handleMonto={handleMonto}
        descuento={descuento}
        acceptEdit={acceptEdit}
      />
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
    </div>
  );
}

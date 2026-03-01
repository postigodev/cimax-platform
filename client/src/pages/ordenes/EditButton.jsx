import { IconButton } from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CONFIG } from "../../config";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import EditForm from "./EditForm";
export default function EditButton({
  id,
  getOrdenes,
  ordenes,
  initialUSB,
  initialEnviado,
  initialCD,
}) {
  const [open, setOpen] = useState(false);
  const [toma, selectToma] = useState([]);
  const [nombres, selectNombres] = useState("");
  const [apellidos, selectApellidos] = useState("");
  const [doctor, selectDoctor] = useState("");
  const [boleta, selectBoleta] = useState("");
  const [monto, selectMonto] = useState("");
  const [tomaTypes, getTomas] = useState([]);
  const [doctorNames, getDoctors] = useState([]);
  const [cd_quemado, selectCD] = useState(false);
  const [usb, selectUSB] = useState(false);
  const [tomo_impresa, selectImpresa] = useState(false);
  const [enviado, selectEnviado] = useState(false);
  const [edad, setEdad] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    selectUSB(initialUSB);
    selectEnviado(initialEnviado);
    selectCD(initialCD);
  }, []);

  const handleDoctor = (e) => selectDoctor(e.target.value);
  
  const handleToma = (e) => {
    const {
      target: { value },
    } = e;
    selectToma(typeof value === "string" ? value.split(",") : value);
  };

  const handleNombres = (e) => selectNombres(e.target.value);
  
  const handleApellidos = (e) => selectApellidos(e.target.value);

  const handleBoleta = (e) => selectBoleta(e.target.value);

  const handleMonto = (e) => selectMonto(e.target.value);

  const handleCD = () => selectCD(!cd_quemado);

  const handleImpresa = () => selectImpresa(!tomo_impresa);

  const handleUSB = () => selectUSB(!usb);

  const handleEnviado = () => selectEnviado(!enviado);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const acceptEdit = () => {
    setOpen(false);
    editOrden();
  };

  const handleAge = (e) => setEdad(e.target.value);


  const handleComentario = (e) => setComentario(e.target.value);

  const editOrden = async () => {
    try {
      toast.loading("Guardando...");
      const { data } = await axios({
        url: `${CONFIG.DOMAIN}/ordenes/edit-orden/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          usb,
          monto,
          cd_quemado,
          tomo_impresa,
          nombres,
          apellidos,
          boleta,
          doctor,
          toma,
          enviado,
          edad,
          comentario,
        },
      });
      const ordenToReplace = ordenes.map((o) => {
        if (o._id === id) return data.orden;
        return o;
      });
      getOrdenes(ordenToReplace);
      //reset();
      toast.dismiss();
      return toast.success("Orden editada con éxito");
    } catch (e) {
      toast.dismiss();
      return toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    const fetchTomas = async () => {
      const req = await axios.get(`${CONFIG.DOMAIN}/doctores/tomas`);
      getTomas(req.data.tomas);
    };
    const fetchDoctors = async () => {
      const req = await axios.get(`${CONFIG.DOMAIN}/doctores/all`);
      getDoctors(req.data.doctores);
    };
    if (!open) return;
    fetchDoctors();
    fetchTomas();
  }, [open]);

  return (
    <>
      <EditForm
        usb={usb}
        enviado={enviado}
        cd_quemado={cd_quemado}
        tomo_impresa={tomo_impresa}
        open={open}
        handleClose={handleClose}
        acceptEdit={acceptEdit}
        handleClickOpen={handleClickOpen}
        handleNombres={handleNombres}
        handleApellidos={handleApellidos}
        toma={toma}
        handleToma={handleToma}
        tomaTypes={tomaTypes}
        doctor={doctor}
        handleDoctor={handleDoctor}
        doctorNames={doctorNames}
        handleCD={handleCD}
        handleUSB={handleUSB}
        handleBoleta={handleBoleta}
        handleImpresa={handleImpresa}
        handleMonto={handleMonto}
        handleAge={handleAge}
        handleEnviado={handleEnviado}
        handleComentario={handleComentario}
        id={id}
      />
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
    </>
  );
}

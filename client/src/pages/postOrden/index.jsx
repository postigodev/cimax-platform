import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import "../styles/css/create-orden.css";
import { CONFIG } from "../../config";

import NamesOrden from "./NamesOrden";
import TomasContainer from "./TomasContainer";
import DoctorContainer from "./DoctorContainer";
import CDContainer from "./CDContainer";
import BoletaContainer from "./BoletaContainer";
import Monto from "./Monto";

export const PostOrden = () => {
  const [toma, selectToma] = useState([]);
  const [nombres, selectNombres] = useState("");
  const [apellidos, selectApellidos] = useState("");
  const [doctor, selectDoctor] = useState("");
  const [boleta, selectBoleta] = useState("");
  const [monto, selectMonto] = useState("");
  const [tomaTypes, getTomas] = useState([]);
  const [doctorNames, getDoctors] = useState([]);
  const [cd_quemado, selectCD] = useState(false);
  const [tomo_impresa, selectImpresa] = useState(false);
  const [enviado, selectEnviado] = useState(false);
  const [usb, selectUSB] = useState(false);
  const [edad, setEdad] = useState(null);
  const [comentario, setComentario] = useState("");

  const [tomasOpen, setTomasOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);

  const handleTomasOpen = () => {
    setTomasOpen(true);
  };
  const handleTomasClose = () => {
    setTomasOpen(false);
  };

  const handleDoctorOpen = () => {
    setDoctorOpen(true);
  };
  const handleDoctorClose = () => {
    setDoctorOpen(false);
  };

  const myRefs = useRef([]);

  const reset = () => {
    selectToma([]);
    selectNombres("");
    selectApellidos("");
    selectDoctor("");
    selectBoleta("");
    selectMonto("");
    selectCD(false);
    selectEnviado(false);
    selectUSB(false);
    setEdad("");
    setComentario("");
  };

  const handleKeyUp = (e, target, select) => {
    if (e.key === "Enter" && target) {
      target.focus();
      if (select) return setTomasOpen(true);
    }
  };

  const handleDoctor = (e) => {
    selectDoctor(e.target.value);
  };
  const handleToma = (e) => {
    const {
      target: { value },
    } = e;
    selectToma(typeof value === "string" ? value.split(",") : value);
  };

  const handleNombres = (e) => {
    selectNombres(e.target.value);
  };

  const handleApellidos = (e) => {
    selectApellidos(e.target.value);
  };

  const handleBoleta = (e) => {
    selectBoleta(e.target.value);
  };

  const handleMonto = (e) => {
    selectMonto(e.target.value);
  };

  const handleCD = () => {
    selectCD(!cd_quemado);
  };

  const handleUSB = () => {
    selectUSB(!usb);
  };

  const handleImpresa = () => {
    selectImpresa(!tomo_impresa);
  };

  const handleEnviado = () => {
    selectEnviado(!enviado);
  };

  const handleAge = (e) => {
    setEdad(e.target.value);
  };

  const handleComentario = (e) => {
    setComentario(e.target.value);
  };

  const submitOrden = async () => {
    try {
      toast.loading("Guardando...");
      await axios({
        url: `${CONFIG.DOMAIN}/ordenes/create-orden`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          nombres,
          apellidos,
          doctor,
          boleta,
          toma,
          cd_quemado,
          usb,
          tomo_impresa,
          monto,
          edad,
          enviado,
          comentario,
        },
      });
      reset();
      toast.dismiss();
      toast.success("Orden guardada con éxito");
    } catch (e) {
      toast.dismiss();
      toast.error(e.response.data.message);
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
    fetchDoctors();
    fetchTomas();
  }, []);

  return (
    <div className="container post-orden-container">
      <h1>Rellene la orden</h1>
      <NamesOrden
        handleNombres={handleNombres}
        handleApellidos={handleApellidos}
        handleAge={handleAge}
        myRefs={myRefs}
        handleKeyUp={handleKeyUp}
        nombres={nombres}
        edad={edad}
        apellidos={apellidos}
      />
      <div className="selects-container">
        <BoletaContainer
          myRefs={myRefs}
          handleKeyUp={handleKeyUp}
          handleBoleta={handleBoleta}
          handleComentario={handleComentario}
          boleta={boleta}
          comentario={comentario}
        />
        <Monto
          handleMonto={handleMonto}
          myRefs={myRefs}
          handleKeyUp={handleKeyUp}
          monto={monto}
          setOpen={setTomasOpen}
          open={tomasOpen}
        />
        <TomasContainer
          tomaTypes={tomaTypes}
          toma={toma}
          handleToma={handleToma}
          myRefs={myRefs}
          handleKeyUp={handleKeyUp}
          setOpen={setDoctorOpen}
          open={tomasOpen}
          handleOpen={handleTomasOpen}
          handleClose={handleTomasClose}
        />
        <DoctorContainer
          doctor={doctor}
          handleDoctor={handleDoctor}
          doctorNames={doctorNames}
          handleKeyUp={handleKeyUp}
          open={doctorOpen}
          handleOpen={handleDoctorOpen}
          handleClose={handleDoctorClose}
          myRefs={myRefs}
          selfOpen={setDoctorOpen}
        />
        <CDContainer
          tomo_impresa={tomo_impresa}
          usb={usb}
          cd={cd_quemado}
          enviado={enviado}
          handleCD={handleCD}
          handleUSB={handleUSB}
          handleEnviado={handleEnviado}
          handleImpresa={handleImpresa}
        />
      </div>
      <div className="boleta-container"></div>
      <Button variant="outlined" onClick={submitOrden}>
        Guardar
      </Button>
    </div>
  );
};

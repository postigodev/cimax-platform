import React from "react";
import axios from "axios";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { CONFIG } from "../../config";

export const CreateDoctor = () => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [convenio, setConvenio] = useState(false);
  const [descuento, setDescuento] = useState(false);
  const [monto, setMonto] = useState(0);

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

  const submitDoctor = async () => {
    try {
        toast.loading();
        await axios({
            url: `${CONFIG.DOMAIN}/doctores/create-doctor`,
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            data: {
                nombres,
                apellidos,
                convenio,
                descuento,
                monto_descuento: monto
            }
        });
        toast.dismiss();
        toast.success('Doctor guardado con éxito');
    } catch(e) {
        toast.dismiss();
        toast.error(e.response.data.message);
    }
  }

  return (
    <div className="container">
      <h1>Crear doctor</h1>
      <div className="names-container flex">
        <div className="input-container">
          <TextField
            id="nombres"
            label="Nombres..."
            variant="outlined"
            onChange={handleNombres}
          />
        </div>
        <div className="input-container">
          <TextField
            id="apellidos"
            label="Apellidos..."
            variant="outlined"
            onChange={handleApellidos}
          />
        </div>
      </div>
      <div className="doctor-selects-container">
        <FormControlLabel
          control={<Switch onChange={handleConvenio} />}
          label="Convenio"
        />
        <FormControlLabel
          control={<Switch onChange={handleDescuento} />}
          label="Descuento"
        />
      </div>
      {descuento ? (
        <div className="input-container">
          <TextField
            id="monto"
            label="Monto..."
            variant="outlined"
            type="number"
            onChange={handleMonto}
          />
        </div>
      ) : (
        ""
      )}
      <Button style={{marginTop: '1em'}} variant="outlined" onClick={submitDoctor}>
        Guardar
      </Button>
    </div>
  );
};

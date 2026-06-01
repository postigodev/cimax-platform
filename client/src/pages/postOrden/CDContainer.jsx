import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

export default function CDContainer({
  handleCD,
  handleUSB,
  handleEnviado,
  enviado,
  cd,
  usb,
  impresa,
  handleImpresa,
}) {
  return (
    <div className="cd-container">
      <FormControlLabel
        control={<Switch onChange={handleCD} checked={cd} />}
        label="CD Quemado"
      />
      <FormControlLabel
        control={<Switch onChange={handleEnviado} checked={enviado} />}
        label="Enviado"
      />
      <FormControlLabel
        control={<Switch onChange={handleUSB} checked={usb} />}
        label="USB"
      />
      <FormControlLabel
        control={<Switch onChange={handleImpresa} checked={impresa} />}
        label="Tomo Impresa"
      />
    </div>
  );
}

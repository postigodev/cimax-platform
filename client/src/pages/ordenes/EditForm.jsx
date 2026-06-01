import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  OutlinedInput,
} from "@mui/material";

export default function EditForm({
  handleClose,
  acceptEdit,
  open,
  handleNombres,
  handleApellidos,
  toma,
  handleToma,
  doctor,
  doctorNames,
  handleCD,
  handleBoleta,
  handleMonto,
  tomaTypes,
  handleDoctor,
  handleImpresa,
  handleUSB,
  apellidos,
  handleComentario,
  handleAge,
  handleEnviado,
  usb,
  enviado,
  cd_quemado,
  tomo_impresa,
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ingrese los datos a editar</DialogTitle>
        <DialogContent>
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
                value={apellidos}
                onChange={handleApellidos}
              />
            </div>
            <div className="input-container">
              <TextField
                id="edad"
                label="Edad..."
                type="number"
                onChange={handleAge}
                variant="outlined"
              />
            </div>
          </div>
          <div className="selects-container">
            <div className="tomas-container input-container">
              <FormControl sx={{ mb: 1, width: 300 }}>
                <InputLabel id="toma-input-label">Toma</InputLabel>
                <Select
                  labelId="toma-label"
                  id="toma"
                  multiple
                  value={toma}
                  onChange={handleToma}
                  input={<OutlinedInput label="Toma" />}
                >
                  {tomaTypes.map(({ nombre, _id }) => (
                    <MenuItem key={_id} value={_id}>
                      {nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="doctores-container input-container">
              <FormControl sx={{ mb: 1, width: 300 }}>
                <InputLabel id="doctor-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  id="doctor"
                  label="Doctor"
                  value={doctor}
                  onChange={handleDoctor}
                >
                  {doctorNames.map(({ nombres, apellidos, _id }) => (
                    <MenuItem key={_id} value={_id}>
                      {nombres + " " + apellidos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="cd-container">
              <FormControlLabel
                control={<Switch onChange={handleCD} checked={cd_quemado} />}
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
                control={
                  <Switch onChange={handleImpresa} checked={tomo_impresa} />
                }
                label="Tomo Impresa"
              />
            </div>
          </div>
          <div className="boleta-container">
            <div className="flex">
              <div className="input-container">
                <TextField
                  id="boleta"
                  label="Boleta..."
                  variant="outlined"
                  onChange={handleBoleta}
                />
              </div>
              <div className="input-container">
                <TextField
                  id="comentario"
                  label="Comentario..."
                  variant="outlined"
                  onChange={handleComentario}
                />
              </div>
            </div>
            <div className="input-container">
              <TextField
                id="monto"
                label="Monto..."
                variant="outlined"
                onChange={handleMonto}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={acceptEdit}>Editar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

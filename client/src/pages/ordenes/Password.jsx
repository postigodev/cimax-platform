import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Password({ handleWrite, handleClose, acceptDelete, open }) {

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ingrese la contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para borrar las órdenes seleccionadas, primero ingrese la contraseña
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Contraseña"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleWrite}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={acceptDelete}>Borrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
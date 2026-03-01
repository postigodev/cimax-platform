import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControlLabel, Switch } from "@mui/material";

export default function EditForm({
  open,
  handleClose,
  acceptEdit,
  handleApellidos,
  handleNombres,
  handleConvenio,
  handleDescuento,
  handleMonto,
  descuento
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={acceptEdit}>Editar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

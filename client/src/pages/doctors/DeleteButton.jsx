import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { CONFIG } from "../../config";
function DeleteButton({ doctor, doctors, id, getDoctors }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const accept = async () => {
    try {
        setOpen(false);
        const { data } = await axios({
            url: `${CONFIG.DOMAIN}/doctores/delete-doctor/${id}`,
            method: 'DELETE'
        });
        getDoctors(doctors.filter(d => d._id !== id));
        toast.success(data.message);
    } catch(e) {
        console.log(e);
        toast.error(e.response.data.message);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Desea eliminar el doctor {doctor}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción es irreversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={accept} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteButton;

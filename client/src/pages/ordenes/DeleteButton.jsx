import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CONFIG } from "../../config";
import Password from "./Password";
import { useState } from "react";
export default function DeleteButton({ setActives, actives, getOrdenes, ordenes }) {
  const [open, setOpen] = useState(false);
  const [psw, setPsw] = useState([]);

  const handleWrite = (e) => {
    setPsw(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const acceptDelete = () => {
    setOpen(false);
    bulkDelete();
  };
  const bulkDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${CONFIG.DOMAIN}/ordenes/delete-orden/`,
        {
          data: {
            ids: actives,
            password: psw,
          },
        }
      );
      getOrdenes(ordenes.filter((o) => !actives.includes(o._id)));
      setActives([]);
      return toast.success(data.message);
    } catch (e) {
      return toast.error(e.response.data.message);
    }
  };

  return (
    <>
      <Password
        open={open}
        handleClose={handleClose}
        acceptDelete={acceptDelete}
        handleClickOpen={handleClickOpen}
        handleWrite={handleWrite}
      />
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon color="primary" />
      </IconButton>
    </>
  );
}

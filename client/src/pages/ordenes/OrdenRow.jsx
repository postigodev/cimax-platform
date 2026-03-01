import { Checkbox, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import EditButton from "./EditButton";
import axios from "axios";
import { CONFIG } from "../../config";
import { toast } from "react-hot-toast";
import ColorsPopover from "./ColorsPopover";

function OrdenRow({
  orden,
  i,
  isSelected,
  select,
  tomas,
  getOrdenes,
  ordenes,
  id,
}) {
  const [anchor, setAnchor] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [mouseX, setMouseX] = useState(null);

  const open = Boolean(anchor);

  const putColor = async (color) => {
    let url = `${CONFIG.DOMAIN}/ordenes/edit-color/${orden._id}`;

    if (color === "doctor") {
      url = `${CONFIG.DOMAIN}/ordenes/edit-doctor-color/${orden._id}`;
    } else if (color === "comentario") {
      url = `${CONFIG.DOMAIN}/ordenes/edit-comment-color/${orden._id}`;
    }
    try {
      const { data } = await axios({
        url,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          color,
        },
      });
      const ordenToReplace = ordenes.map((o) => {
        if (o._id === id) return data.orden;
        return o;
      });
      getOrdenes(ordenToReplace);
      handleClose();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!e.type === "contextmenu") return;
    setAnchor(e.currentTarget);
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <TableRow
        onContextMenu={handleClick}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        style={{ padding: "auto 0", margin: "auto 0", background: orden.color }}
      >
        <TableCell>
          <Checkbox
            checked={isSelected}
            onClick={(e) => select(e, orden._id)}
          />
          <EditButton
            initialCD={orden.cd_quemado}
            initialUSB={orden.usb}
            initialEnviado={orden.enviado}
            id={orden._id}
            ordenes={ordenes}
            getOrdenes={getOrdenes}
          />
        </TableCell>
        <TableCell size="small" align="center">
          {i + 1}
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(orden.date).format("D/M/YYYY")}
        </TableCell>
        <TableCell align="center">{orden.nombres}</TableCell>
        <TableCell align="center">{orden.apellidos}</TableCell>
        <TableCell align="center">{orden.edad}</TableCell>
        <TableCell
          align="center"
          style={{ background: orden.doctor_color ? "orange" : orden.color }}
        >
          {orden.doctor.nombres + " " + orden.doctor.apellidos}
        </TableCell>
        <TableCell align="center">
          {tomas.map((t) => (
            <span key={t}>
              {t}
              <br />
            </span>
          ))}
        </TableCell>
        <TableCell align="center">{orden.cd_quemado ? "Sí" : "No"}</TableCell>
        <TableCell align="center">{orden.enviado ? "Sí" : "No"}</TableCell>
        <TableCell align="center">{orden.usb ? "Sí" : "No"}</TableCell>
        <TableCell align="center">{orden.tomo_impresa ? "Sí" : "No"}</TableCell>
        <TableCell align="center">
          {orden.boletaa ? orden.boletaa : "CANCELÓ EN CLÍNICA"}
        </TableCell>
        <TableCell
          align="center"
          style={{ background: orden.comment_color ? "#fbff93" : orden.color }}
        >
          {orden.comentario ? orden.comentario : "N/A"}
        </TableCell>
        <TableCell align="center">{orden.monto}</TableCell>
      </TableRow>
      <ColorsPopover
        open={open}
        anchor={anchor}
        handleClose={handleClose}
        mouseY={mouseY}
        mouseX={mouseX}
        putColor={putColor}
      />
    </>
  );
}

export default OrdenRow;

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import SelectSort from "./selectSort";
import { toast } from "react-hot-toast";
import { CONFIG } from "../../config";
import OrdenRow from "./OrdenRow";

const rows = [
  "",
  "ID",
  "Fecha",
  "Nombres",
  "Apellidos",
  "Edad",
  "Doctor",
  "Toma",
  "CD Quemado",
  "Enviado",
  "USB",
  "Tomo Impresa",
  "Boleta",
  "Comentario",
  "Monto",
];

export const Ordenes = () => {
  const [secondary, setSecondary] = useState("");
  const [terciary, setTerciary] = useState("");
  const [cuaternary, setCuaternary] = useState("");
  const [start, setStart] = useState(dayjs(new Date()));
  const [end, setEnd] = useState(dayjs());
  const [ordenes, getOrdenes] = useState([]);
  const [sort, setSort] = useState("");
  const [actives, setActives] = useState([]);

  const selected = (id) => actives.includes(id);

  const select = (e, id) => {
    const selectedIndex = actives.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(actives, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(actives.slice(1));
    } else if (selectedIndex === actives.length - 1) {
      newSelected = newSelected.concat(actives.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        actives.slice(0, selectedIndex),
        actives.slice(selectedIndex + 1)
      );
    }
    setActives(newSelected);
  };

  const submitFilter = async () => {
    let gtes = `${dayjs(start).format("MM-DD-YYYY")}/${dayjs(end).format(
      "MM-DD-YYYY"
    )}`;

    try {
      toast.loading();
      let endpoint;
      const getEndpoint = {
        1: () => endpoint = `get-by-doctor/${secondary}/${gtes}`,
        2: () => endpoint = `get-by-toma/${secondary}/${gtes}`,
        3: () => endpoint = `get-by-doctor-toma/${cuaternary}/${secondary}/${gtes}`,
        4: () => endpoint = `get-by-usb/${gtes}`,
        5: () => endpoint = `get-by-color/${gtes}`,
        6: () => endpoint = `get-by-paciente/${terciary}`,
        7: () => endpoint = `get-by-boleta/${terciary}`,
        'def': () => endpoint = `get-all/${gtes}`
      };
      (getEndpoint[sort] || getEndpoint['def'])();
      const { data } = await axios.get(`${CONFIG.DOMAIN}/ordenes/${endpoint}`);
      toast.dismiss();
      getOrdenes(data.ordenes);
    } catch (e) {
      toast.dismiss();
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const { data } = await axios.get(
        `${CONFIG.DOMAIN}/ordenes/get-all/${dayjs(new Date()).format(
          "M-D-YYYY"
        )}/${dayjs(tomorrow).format("M-D-YYYY")}`
      );
      getOrdenes(data.ordenes);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container ordenes-container">
      <div className="sort-container flex">
        <h1>Tabla de Órdenes</h1>
        <SelectSort
          submitFilter={submitFilter}
          sort={sort}
          setSort={setSort}
          secondary={secondary}
          setSecondary={setSecondary}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          setTerciary={setTerciary}
          actives={actives}
          getOrdenes={getOrdenes}
          ordenes={ordenes}
          setActives={setActives}
          cuaternary={cuaternary}
          setCuaternary={setCuaternary}
        />
      </div>
      <TableContainer sx={{ maxHeight: 650 }} component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {rows.map((r) => (
                <TableCell align="center">
                  <b>{r}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes
              .map((orden, i) => {
                const isSelected = selected(orden._id);
                const tomas = orden.toma.map((t) => t.nombre);
                return (
                  <OrdenRow
                    id={orden._id}
                    key={i}
                    orden={orden}
                    tomas={tomas}
                    isSelected={isSelected}
                    getOrdenes={getOrdenes}
                    select={select}
                    ordenes={ordenes}
                    i={i}
                  />
                );
              })
              .reverse()}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

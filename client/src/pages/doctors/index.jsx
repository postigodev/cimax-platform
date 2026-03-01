import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CONFIG } from "../../config";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

const rows = [
  "Nombres",
  "Apellidos",
  "Convenio",
  "Descuento",
  "Monto Descuento",
  "",
  "",
];
export const Doctores = () => {
  const [doctors, getDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${CONFIG.DOMAIN}/doctores/all`);
      getDoctors(data.doctores);
    };
    fetchDoctors();
  }, []);

  return (
    <div className="container ordenes-container">
      <h1>Tabla de Doctores</h1>
      <TableContainer sx={{ maxHeight: 650 }} component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {rows.map((r, i) => (
                <TableCell key={i} align="left">
                  <b>{r}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(
              ({
                nombres,
                apellidos,
                convenio,
                descuento,
                monto_descuento,
                _id,
              }) => (
                <TableRow
                  key={_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{nombres}</TableCell>
                  <TableCell align="left">{apellidos}</TableCell>
                  <TableCell align="left">{convenio ? "Sí" : "No"}</TableCell>
                  <TableCell align="left">{descuento ? "Sí" : "No"}</TableCell>
                  <TableCell align="left">
                    {descuento ? monto_descuento : "N/A"}
                  </TableCell>
                  <TableCell align="left">
                    <EditButton
                      id={_id}
                      doctors={doctors}
                      getDoctor={getDoctors}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <DeleteButton
                      doctor={nombres + " " + apellidos}
                      id={_id}
                      getDoctors={getDoctors}
                      doctors={doctors}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

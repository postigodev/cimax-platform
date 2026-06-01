import React from "react";
import { Select, FormControl, MenuItem, InputLabel, Divider, Button } from '@mui/material';
import { useEffect, useState } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PickDate from "./PickDate";
import { CONFIG } from "../../config";
import DeleteButton from "./DeleteButton";

const SelectSort = ({
  submitFilter,
  sort,
  setSort,
  secondary,
  setSecondary,
  start,
  end,
  setEnd,
  setStart,
  setTerciary,
  actives,
  getOrdenes,
  setActives,
  ordenes,
  setCuaternary,
  cuaternary,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [tomas, setTomas] = useState([]);

  const handleSort = (e) => setSort(e.target.value);

  const handleSecondary = (e) => setSecondary(e.target.value);

  const handleCuaternary = (e) => setCuaternary(e.target.value);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${CONFIG.DOMAIN}/doctores/all`);
      setDoctors(data.doctores);
    };
    const fetchTomas = async () => {
      const { data } = await axios.get(`${CONFIG.DOMAIN}/doctores/tomas`);
      setTomas(data.tomas);
    };
    fetchDoctors();
    fetchTomas();
  }, []);

  return (
    <div className="select-sort-container">
      <PickDate
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        setTerciary={setTerciary}
        sort={sort}
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="sort-label">Filtrar por...</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={sort}
          label="Filtrar por..."
          onChange={handleSort}
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          <Divider />
          <MenuItem value={1}>Doctor</MenuItem>
          <MenuItem value={2}>Toma</MenuItem>
          <MenuItem value={3}>Doctor / Toma</MenuItem>
          <Divider />
          <MenuItem value={4}>USB</MenuItem>
          <MenuItem value={5}>Color</MenuItem>
          <Divider />
          <MenuItem value={6}>Paciente</MenuItem>
          <MenuItem value={7}>Boleta</MenuItem>
        </Select>
      </FormControl>
      {sort === 3 ? (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="sort-cuaternary">Doctor</InputLabel>
          <Select
            labelId="sort-cuaternary"
            id="sort-doctor-toma"
            value={cuaternary}
            label="Doctor"
            onChange={handleCuaternary}
            defaultValue=""
          >
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            {doctors.map(({ nombres, apellidos, _id }) => (
              <MenuItem key={_id} value={_id}>
                {nombres} {apellidos}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        ""
      )}
      {sort <= 3 && sort !== "" ? (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="sort-secondary">
            {sort === 1 ? "Doctor" : "Toma"}
          </InputLabel>
          <Select
            labelId="sort-secondary"
            id="sort-doctor-toma"
            value={secondary}
            label={sort === 1 ? "Doctor" : "Toma"}
            onChange={handleSecondary}
            defaultValue=""
          >
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            {sort === 1
              ? doctors.map(({ nombres, apellidos, _id }) => (
                  <MenuItem key={_id} value={_id}>
                    {nombres} {apellidos}
                  </MenuItem>
                ))
              : tomas.map(({ nombre, _id }) => (
                  <MenuItem key={_id} value={_id}>
                    {nombre}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      ) : (
        ""
      )}
      <Button
        onClick={submitFilter}
        variant="outlined"
        startIcon={<FilterAltIcon />}
      >
        Filtrar
      </Button>
      {actives.length !== 0 ? (
        <DeleteButton
          setActives={setActives}
          ordenes={ordenes}
          getOrdenes={getOrdenes}
          actives={actives}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectSort;

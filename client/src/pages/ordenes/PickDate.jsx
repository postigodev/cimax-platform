import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";

const PickDate = ({ start, end, setEnd, setStart, sort, setTerciary }) => {
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEnd(tomorrow);
  }, [setEnd]);

  const handleStart = (newValue) => {
    setStart(newValue);
  };
  const handleEnd = (newValue) => {
    setEnd(newValue);
  };

  const handleTerciary = (e) => {
    setTerciary(e.target.value);
  };

  return (
    <div className="container">
      {sort <= 5 ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <span style={{marginRight: '1em'}}>
            <DesktopDatePicker
              label="Fecha inicio"
              inputFormat="DD/MM/YYYY"
              value={start}
              onChange={handleStart}
              renderInput={(params) => <TextField {...params} />}
            />
          </span>
          <DesktopDatePicker
            label="Fecha fin"
            inputFormat="DD/MM/YYYY"
            value={end}
            onChange={handleEnd}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      ) : (
        <TextField
          id={sort === 6 ? "nombre-paciente" : "boleta"}
          label={sort === 6 ? "Nombre del paciente..." : "Boleta..."}
          variant="outlined"
          onChange={handleTerciary}
        />
      )}
    </div>
  );
};

export default PickDate;

import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function DoctorContainer({
  doctor,
  handleDoctor,
  doctorNames,
  open,
  handleClose,
  handleOpen,
  handleKeyUp,
  myRefs,
  setOpen,
  selfOpen
}) {
  return (
    <div className="doctores-container input-container">
      <FormControl sx={{ mb: 1, width: 300 }}>
        <InputLabel id="doctor-label">Doctor</InputLabel>
        <Select
          onKeyUp={(e) => {
            handleKeyUp(e, myRefs.current[7 === 8 - 1 ? 0 : 7 + 1]);
            setOpen(true);
          }}
          inputRef={(el) => (myRefs.current[7] = el)}
          onOpen={handleOpen}
          onClose={handleClose}
          open={open}
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
  );
}

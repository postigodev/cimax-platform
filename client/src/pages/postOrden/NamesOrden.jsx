import React from "react";
import { TextField } from "@mui/material";

export default function NamesOrden({
  handleApellidos,
  handleNombres,
  handleAge,
  myRefs,
  handleKeyUp,
  nombres,
  apellidos,
  edad,
}) {
  return (
    <div className="names-container flex">
      <div className="input-container">
        <TextField
          onKeyUp={(e) =>
            handleKeyUp(e, myRefs.current[0 === 8 - 1 ? 0 : 0 + 1])
          }
          value={nombres}
          inputRef={(el) => (myRefs.current[0] = el)}
          id="nombres"
          label="Nombres..."
          variant="outlined"
          onChange={handleNombres}
        />
      </div>
      <div className="input-container">
        <TextField
          onKeyUp={(e) => {
            handleKeyUp(e, myRefs.current[1 === 8 - 1 ? 0 : 1 + 1]);
          }}
          value={apellidos}
          inputRef={(el) => (myRefs.current[1] = el)}
          id="apellidos"
          label="Apellidos..."
          variant="outlined"
          onChange={handleApellidos}
        />
      </div>
      <div className="input-container">
        <TextField
          onKeyUp={(e) => {
            handleKeyUp(e, myRefs.current[2 === 8 - 1 ? 0 : 2 + 1]);
          }}
          inputRef={(el) => (myRefs.current[2] = el)}
          value={edad}
          id="edad"
          label="Edad..."
          type="number"
          onChange={handleAge}
          variant="outlined"
        />
      </div>
    </div>
  );
}

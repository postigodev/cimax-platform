import React from "react";
import { TextField } from "@mui/material";

export default function Monto({ handleMonto, myRefs, handleKeyUp, monto, setOpen, open }) {
  return (
    <div className="input-container">
      <TextField
        onKeyUp={(e) => {
          handleKeyUp(e, myRefs.current[5 === 8 - 1 ? 0 : 5 + 1], true);
        }}
        inputRef={(el) => (myRefs.current[5] = el)}
        id="monto"
        label="Monto..."
        type="number"
        variant="outlined"
        onChange={handleMonto}
        value={monto}
      />
    </div>
  );
}

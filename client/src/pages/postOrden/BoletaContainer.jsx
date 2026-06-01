import React from "react";
import { TextField } from "@mui/material";

export default function BoletaContainer({
  handleBoleta,
  handleComentario,
  myRefs,
  handleKeyUp,
  comentario,
  boleta
}) {
  return (
    <div className="flex">
      <div className="input-container">
        <TextField
          onKeyUp={(e) =>
            handleKeyUp(e, myRefs.current[3 === 8 - 1 ? 0 : 3 + 1])
          }
          inputRef={(el) => (myRefs.current[3] = el)}
          id="boleta"
          label="Boleta..."
          variant="outlined"
          onChange={handleBoleta}
          value={boleta}
        />
      </div>
      <div className="input-container">
        <TextField
          onKeyUp={(e) =>
            handleKeyUp(e, myRefs.current[4 === 8 - 1 ? 0 : 4 + 1])
          }
          inputRef={(el) => (myRefs.current[4] = el)}
          id="comentario"
          label="Comentario..."
          variant="outlined"
          value={comentario}
          onChange={handleComentario}
        />
      </div>
    </div>
  );
}

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

export default function TomasContainer({
  tomaTypes,
  toma,
  handleToma,
  myRefs,
  handleKeyUp,
  open,
  handleClose,
  handleOpen,
}) {
  return (
    <div>
      <FormControl sx={{ mb: 1, width: 300 }}>
        <InputLabel id="toma-input-label">Toma</InputLabel>
        <Select
          onKeyUp={(e) => {    
            handleKeyUp(e, myRefs.current[6 === 8 - 1 ? 0 : 6 + 1]);
          }}
          inputRef={(el) => (myRefs.current[6] = el)}
          labelId="toma-label"
          id="toma"
          multiple
          value={toma}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          onChange={handleToma}
          input={<OutlinedInput label="Toma" />}
        >
          {tomaTypes.map(({ nombre, _id }) => (
            <MenuItem key={_id} value={_id}>
              {nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

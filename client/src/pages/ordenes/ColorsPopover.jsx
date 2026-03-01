import { MenuItem, Menu, Divider } from "@mui/material";

function ColorsPopover({
  open,
  anchor,
  handleClose,
  mouseY,
  mouseX,
  putColor,
}) {
  return (
    <Menu
      open={open}
      anchorEl={anchor}
      anchorReference="anchorPosition"
      anchorPosition={{ top: mouseY, left: mouseX }}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={() => putColor('cyan')}>Azul</MenuItem>
      <MenuItem onClick={() => putColor('#00a000')}> Verde</MenuItem>
      <MenuItem onClick={() => putColor('#fff')}>Ninguno</MenuItem>
      <Divider />
      <MenuItem onClick={() => putColor("comentario")}>Comentario</MenuItem>
      <MenuItem onClick={() => putColor("doctor")}>Doctor</MenuItem>
    </Menu>
  );
}

export default ColorsPopover;

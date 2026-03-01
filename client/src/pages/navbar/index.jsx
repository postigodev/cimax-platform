import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  let navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              CIMAX ORDENES
            </Button>
          </Typography>
          <Button color="inherit" onClick={() => navigate("/doctores")}>
            Doctores
          </Button>
          <Button color="inherit" onClick={() => navigate("/crear-doctor")}>
            Crear doctor
          </Button>
          <Button color="inherit" onClick={() => navigate("/ordenes")}>
            Órdenes
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

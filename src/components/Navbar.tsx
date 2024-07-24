import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface NavbarProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ children, isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Using navigate for navigation instead of href to prevent full page reloads
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sveikutis
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigateTo("/")}>
              Pagrindinis Puslapis
            </Button>
            {isLoggedIn ? (
              <>
                <Button color="inherit" onClick={() => navigateTo("/quizzes")}>
                  Klausimynai
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigateTo("/create-quiz")}
                >
                  Sukurti Klausimyną
                </Button>
                <Button color="inherit" onClick={() => navigateTo("/classes")}>
                  Klasės
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigateTo("/create-class")}
                >
                  Pridėti klasę
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Atsijungti
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigateTo("/login")}>
                  Prisijungti
                </Button>
                <Button color="inherit" onClick={() => navigateTo("/register")}>
                  Registruotis
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

interface ClassInfo {
  id: string;
  classname: string;
  code: number;
}

function Classes() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          API_URL + "/Classroom/GetAllTeacherClasses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.status === 200) {
          setClasses(response.data);
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {classes.length > 0 ? (
            <>
              <Typography component="h1" variant="h5">
                Jūsų klasės:
              </Typography>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {classes.map((c, index) => (
                  <React.Fragment key={c.id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <Button
                          variant="contained"
                          onClick={() => navigate("/class/" + c.id)}
                        >
                          Peržiūrėti
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>{c.classname[0]}</Avatar>{" "}
                        {/* Placeholder with the first letter of classname */}
                      </ListItemAvatar>
                      <ListItemText
                        primary={c.classname}
                        secondary={`Kodas: ${c.code}`}
                      />
                    </ListItem>
                    {index < classes.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h5">
                Nėra sukurtų klasių
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/create-class")}
              >
                Sukurti klasę
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Classes;

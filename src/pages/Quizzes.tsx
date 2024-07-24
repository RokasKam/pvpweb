import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../contexts/QuizContext"; // Ensure this path is correct
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
import { parseISO, format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const defaultTheme = createTheme();

const Quizzes: React.FC = () => {
  const { quizzes, deleteQuiz } = useContext(QuizContext)!;
  const navigate = useNavigate();

  const handleDelete = (quizId: string) => {
    deleteQuiz(quizId);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        {" "}
        {/* maxWidth adjusted for better spacing */}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {quizzes && quizzes.length > 0 ? (
            <>
              <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
                Jūsų klausimynai:
              </Typography>
              <List sx={{ width: "100%" }}>
                {" "}
                {/* Removed maxWidth for full width usage */}
                {quizzes.map((quiz) => (
                  <React.Fragment key={quiz.id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <>
                          <Button
                            variant="contained"
                            onClick={() => navigate("/quiz/" + quiz.id)}
                          >
                            Peržiūrėti
                          </Button>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            sx={{ marginLeft: "15px" }}
                            onClick={() => handleDelete(quiz.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>{quiz.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={quiz.name}
                        secondary={`Galioja iki: ${
                          quiz.expirationDate
                            ? format(
                                parseISO(quiz.expirationDate),
                                "yyyy-MM-dd HH:mm"
                              )
                            : "Nėra"
                        }`} // Secondary text for the expiration date
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h5" sx={{ mt: 4, mb: 2 }}>
                Nėra sukurtų klausimynų
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/create-quiz")}
              >
                Sukurti klausimyną
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Quizzes;

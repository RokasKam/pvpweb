import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../Utils/Configuration";
import axios from "axios";
import { QuizContext } from "../contexts/QuizContext";
import StudentsList from "../components/StudentsList";
import QuizzesList from "../components/QuizzesList";
import StudentForm from "../components/StudentForm";
import QuizSelector from "../components/QuizSelector";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface Student {
  id: string;
  username: string;
}

interface Quiz {
  id: string;
  quizId: string;
  name: string;
  teacherId: string;
  expirationDate: string;
}

function Class() {
  const { classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const { quizzes, setQuizzes } = useContext(QuizContext)!;
  const [classQuizzes, setClassQuizzes] = useState<Quiz[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openQuizSelect, setOpenQuizSelect] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");

  const formatDateForEndpoint = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  };
  
  // Function to handle the submission of the selected quiz
  const handleSubmit = async (selectedQuiz: string) => {
    // Ensure we have a selected quiz and a classId
    if (!selectedQuiz || !classId) {
      console.error("No quiz selected or classId missing");
      return;
    }
  
    // Format the date and log for debugging
    const formattedDate = formatDateForEndpoint(selectedDateTime);
    console.log("Formatted Date:", formattedDate);
  
    try {
      const postData = {
        expirationDate: formattedDate,
        classroomId: classId,
        quizId: selectedQuiz,
      };
      console.log("Post Data:", postData);
  
      const response = await axios.post(
        `${API_URL}/Quiz/AddNewQuizForClass`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Quiz successfully added to class", response.data);
        // Perform any additional actions on success, e.g., show a success message, refresh quizzes list, etc.
      } else {
        throw new Error(`Failed to add quiz: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to add quiz to class:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/Student/DeleteStudent?studentId=${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      if (response.status === 200) {
        console.log(`Student with ID: ${studentId} has been removed.`);
        setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
      } else {
        console.error(`Failed to remove student with ID: ${studentId}. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error removing student with ID: ${studentId}:`, error);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Student/GetAllStudentsByClass?classId=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    const fetchClassQuizzes = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Quiz/GetAllClassesQuiz?classId=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setClassQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    fetchClassQuizzes();
    fetchStudents();
  }, [classId]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main">
        <CssBaseline />
        <Grid container spacing={3} sx={{ marginTop: 8 }}>
          {/* Students Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Mokiniai:
              </Typography>
              {students.length > 0 ? (
                <StudentsList students={students} removeStudent={handleRemoveStudent} />
              ) : (
                <Typography variant="subtitle1">
                  Klasėje nėra mokinių
                </Typography>
              )}
              {openForm && (
                <StudentForm
                  classId={classId!}
                  onStudentAdded={() => {
                    setOpenForm(false);
                    window.location.reload();
                  }}
                />
              )}
              {!openForm && (
                <Button
                  variant="contained"
                  onClick={() => setOpenForm(true)}
                  sx={{ mt: 2 }}
                >
                  Pridėti mokinį
                </Button>
              )}
            </Box>
          </Grid>

          {/* Quizzes Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Klausimynai:
              </Typography>

              {classQuizzes.length > 0 ? (
                <QuizzesList quizzes={classQuizzes} />
              ) : (
                <Typography variant="subtitle1">
                  Klasėje neturi priskirtų klausimynų
                </Typography>
              )}
              {openQuizSelect && (
                <QuizSelector
                  quizzes={quizzes}
                  selectedQuiz={selectedQuiz}
                  setSelectedQuiz={setSelectedQuiz}
                  selectedDateTime={selectedDateTime}
                  setSelectedDateTime={setSelectedDateTime}
                  handleSubmit={() => handleSubmit(selectedQuiz)}
                />
              )}
              {!openQuizSelect && (
                <Button
                  variant="contained"
                  onClick={() => setOpenQuizSelect(true)}
                  sx={{ mt: 2 }}
                >
                  Priskirti klausimyną
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Class;

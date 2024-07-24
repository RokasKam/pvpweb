import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";
import QuestionForm from "../components/QuestionForm";
import QuestionEditForm from '../components/QuestionEditForm'; 
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';


interface Option {
  id: string;
  optionText: string;
  isCorrect: boolean;
  questionId: string;
}

interface Question {
  id: string;
  quizId: string;
  text: string;
  explanation: string;
  category: "Multiple" | "One" | "Word";
  imageURL?: string;
  optionResponses: Option[]; // Assuming we rename optionRequests to options for consistency
  points: number;
}



const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/Question/DeleteQuestion?questionId=${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(`Question with ID: ${questionId} has been removed.`);
        const updatedQuestions = questions.filter(
          (question) => question.id !== questionId
        );
        setQuestions(updatedQuestions);
      } else {
        console.error(
          `Failed to remove question with ID: ${questionId}. Status code: ${response.status}`
        );
      }
    } catch (error) {
      console.error(`Error removing question with ID: ${questionId}:`, error);
    }
  };

  const handleOpenEditForm = (question: Question) => {
    setEditQuestion(question);
  };

  const handleCloseEditForm = () => {
    setEditQuestion(null);
  };

  const handleSaveQuestion = async (updatedQuestionId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/Question/GetQuestionById?questionId=${updatedQuestionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const updatedQuestions = questions.map(q => q.id === response.data.id ? response.data : q);
      setQuestions(updatedQuestions);
      handleCloseEditForm();
    } catch (error: any) {
      setError(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_URL}/Question/GetAllQuizzesQuestions?quizId=${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setQuestions(response.data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message || "An error occurred");
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Klausimai:
      </Typography>
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!isLoading && !error && questions.length === 0 && (
        <Typography>Šis klausimynas yra tuščias.</Typography>
      )}
      {!isLoading &&
        questions.map((question, index) => (
          <Card
            key={index}
            sx={{ marginBottom: "20px", position: "relative", display: "flex" }}
          >
            {(question.imageURL) && (
              <CardMedia
                component="img"
                sx={{ width: 151, height: 151, objectFit: "cover" }}
                image={question.imageURL}
                alt="Question Image"
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5">{question.text}</Typography>
              <Chip
                label={
                  question.category === "One"
                    ? "Vienas teisingas"
                    : question.category === "Multiple"
                    ? "Keli teisingi"
                    : "Atvirojo tipo"
                }
                sx={{ margin: "8px 0" }}
              />
              <Typography variant="body2">{question.explanation}</Typography>
              <Typography variant="body2" color="text.secondary">
                Taškai: {question.points}
              </Typography>
            </CardContent>
            <IconButton
              onClick={() => handleDeleteQuestion(question.id)}
              sx={{ position: "absolute", top: "10px", right: "10px" }}
              aria-label="delete"
            >
              <DeleteIcon sx={{ color: "grey" }} />
            </IconButton>
            <IconButton
              onClick={() => handleOpenEditForm(question)}
              sx={{ position: "absolute", top: "10px", right: "50px" }} // Adjust position as needed
              aria-label="edit"
            >
              <EditIcon sx={{ color: "grey" }} />
            </IconButton>
          </Card>
        ))}
      {editQuestion && (
        <QuestionEditForm
          question={editQuestion}
          open={Boolean(editQuestion)}
          onClose={handleCloseEditForm}
          onSave={handleSaveQuestion}
        />
      )}
      {openForm && quizId && <QuestionForm quizId={quizId} />}
      {!openForm && (
        <Button
          variant="contained"
          onClick={() => setOpenForm(true)}
          sx={{ mt: 2 }}
        >
          Pridėti klausimą
        </Button>
      )}
    </Box>
  );  
};

export default Quiz;

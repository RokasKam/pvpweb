import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { QuizInfo } from '../contexts/QuizContext';  // Adjust the path as necessary

interface QuizSelectorProps {
  quizzes: QuizInfo[];
  selectedQuiz: string;
  setSelectedQuiz: (quizId: string) => void;
  selectedDateTime: string;
  setSelectedDateTime: (dateTime: string) => void;
  handleSubmit: () => void;
}

const QuizSelector: React.FC<QuizSelectorProps> = ({
  quizzes,
  selectedQuiz,
  setSelectedQuiz,
  selectedDateTime,
  setSelectedDateTime,
  handleSubmit
}) => {
  return (
    <Box sx={{ minWidth: 240 }}>
      <FormControl fullWidth>
        <InputLabel id="quiz-select-label">Klausimynas</InputLabel>
        <Select
          labelId="quiz-select-label"
          id="quiz-select"
          value={selectedQuiz}
          label="Klausimynas"
          onChange={(event) => setSelectedQuiz(event.target.value as string)}
        >
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id}>
              {quiz.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Select Date and Time"
        type="datetime-local"
        sx={{ mt: 2, mb: 2 }}
        fullWidth
        value={selectedDateTime}
        onChange={(event) => setSelectedDateTime(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Pridėti Klausimyną
      </Button>
    </Box>
  );
};

export default QuizSelector;

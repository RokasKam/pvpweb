import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { parseISO, format } from "date-fns";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Leaderboard from "./Leaderboard";

interface Quiz {
  id: string;
  quizId: string;
  name: string;
  teacherId: string;
  expirationDate: string;
}

interface QuizzesListProps {
  quizzes: Quiz[];
}

const QuizzesList: React.FC<QuizzesListProps> = ({ quizzes }) => {
  const [open, setOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const handleClickOpen = (quizId: string) => {
    setSelectedQuizId(quizId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {quizzes.map((quiz, index) => (
          <React.Fragment key={quiz.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Button 
                  onClick={() => handleClickOpen(quiz.id)}
                  sx={{ ml: 1 }} // Add left margin to the button for spacing
                >
                  Turnyrinė lentelė
                </Button>
              }
              sx={{
                display: 'flex', 
                justifyContent: 'space-between', // This will push the button to the far right
                alignItems: 'center',
                width: '100%', // Ensure the list item takes full width
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar
                    alt={quiz.name}
                    src={`/static/images/avatar/${index + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={quiz.name}
                  secondary={`Galioja iki: ${
                    quiz.expirationDate
                      ? format(parseISO(quiz.expirationDate), "yyyy-MM-dd HH:mm")
                      : "Nėra"
                  }`} // This checks if expirationDate is provided before formatting
                  sx={{ mr: 2 }} // Add right margin to the text for spacing
                />
              </Box>
            </ListItem>
            {index < quizzes.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      <Leaderboard open={open} onClose={handleClose} quizId={selectedQuizId} />
    </>
  );
};

export default QuizzesList;

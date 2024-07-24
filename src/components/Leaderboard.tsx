import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  quizId: string | null;
}

interface LeaderboardEntry {
  score: number;
  correctAnswers: number;
  answeredQuestions: number;
  name: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ open, onClose, quizId }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !quizId) return;

    setLoading(true);
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Student/GetLeaderboardOfQuiz?classQuizId=${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setLeaderboardData(response.data);
        setError(null);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          setError("Failed to load leaderboard data: " + (error.message));
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [open, quizId]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="leaderboard-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="leaderboard-dialog-title">Turnyrinė lentelė</DialogTitle>
      <DialogContent>
        {loading && <DialogContentText>Kraunama...</DialogContentText>}
        {error && <DialogContentText color="error">{error}</DialogContentText>}
        {!loading && !error && leaderboardData.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vardas</TableCell>
                <TableCell align="right">Įvertinimas</TableCell>
                <TableCell align="right">Teisingi atsakymai</TableCell>
                <TableCell align="right">Atsakyti klausimai</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{item.name}</TableCell>
                  <TableCell align="right">{item.score}</TableCell>
                  <TableCell align="right">{item.correctAnswers}</TableCell>
                  <TableCell align="right">{item.answeredQuestions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && !error && leaderboardData.length === 0 && (
          <DialogContentText>Turnyrinė lentelė nepasiekiama.</DialogContentText>
        )}
        <Button onClick={onClose} sx={{ mt: 2 }}>Uždaryti</Button>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;

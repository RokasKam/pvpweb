import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from "axios";
import { API_URL } from "../Utils/Configuration";

// Export this interface so it can be imported elsewhere
export interface QuizInfo {
    id: string;
    quizId: string;
    name: string;
    teacherId: string;
    expirationDate: string;
}

interface QuizContextType {
  quizzes: QuizInfo[];
  setQuizzes: React.Dispatch<React.SetStateAction<QuizInfo[]>>;
  deleteQuiz: (quizId: string) => void;
}

export const QuizContext = createContext<QuizContextType | null>(null);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([]);

  const deleteQuiz = async (quizId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/Quiz/DeleteQuiz?quizId=${quizId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      if (response.status === 200) {
        console.log(`Quiz with ID: ${quizId} has been removed.`);
        setQuizzes(currentQuizzes => currentQuizzes.filter(quiz => quiz.quizId !== quizId));
        window.location.reload();
      } else {
        console.error(`Failed to remove quiz with ID: ${quizId}. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error removing quiz with ID: ${quizId}:`, error);
    }
    
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Quiz/GetAllTeacherQuizzes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.status === 200) {
          setQuizzes(response.data);
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        console.error("Failed to fetch quizzes: ", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <QuizContext.Provider value={{ quizzes, setQuizzes, deleteQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CreateClassroom from "./pages/CreateClassroom";
import Classes from "./pages/Classes";
import Class from "./pages/Class";
import Quizzes from "./pages/Quizzes";
import CreateQuiz from "./pages/CreateQuiz";
import { QuizProvider } from './contexts/QuizContext';
import Quiz from "./pages/Quiz";
import Navbar from "./components/Navbar";
import { API_URL } from "./Utils/Configuration";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL + "/Teacher/GetTeacher", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
  
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Checking login status failed, trying to refresh token.");
        try {
          const refreshData = {
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: localStorage.getItem("refreshToken"),
          };
          const refreshResponse = await axios.post(API_URL + "/Teacher/Refresh", refreshData);
          if (refreshResponse.status === 200) {
            localStorage.setItem("accessToken", refreshResponse.data.accessToken);
            localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
            setIsLoggedIn(true);
          } else {
            throw new Error("Refresh token failed");
          }
        } catch (refreshError) {
          console.error(refreshError);
          setIsLoggedIn(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Router>
      <QuizProvider>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-class" element={<CreateClassroom />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/class/:classId" element={<Class />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
          </Routes>
        </Navbar>
      </QuizProvider>
    </Router>
  );
}

export default App;

import React, { FormEvent } from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";
import { Grid, Box, TextField, Button, Container } from '@mui/material';

interface Props {
  classId: string;
  onStudentAdded: () => void;
}

const StudentForm: React.FC<Props> = ({ classId, onStudentAdded }) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const studentData = {
      username: data.get("username"),
      password: data.get("password"),
      classroomId: classId,
    };

    try {
      await axios.post(`${API_URL}/Student/Register`, studentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      onStudentAdded(); // Notify parent component that a student was added
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Register failed.", error.response?.status);
      } else {
        console.error("Error during Axios request:", error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <TextField
            required
            fullWidth
            id="username"
            label="Mokinio slapyvardis"
            name="username"
            autoComplete="username"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Slaptažodis"
            type="password"
            id="password"
            autoComplete="password"
          />
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Pridėti mokinį
        </Button>
      </Box>
    </Container>
  );
}

export default StudentForm;

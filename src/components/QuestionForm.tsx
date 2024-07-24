import React, { FormEvent, useState } from "react";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";
import {
  Grid,
  Box,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface Props {
  quizId: string;
}

const QuestionForm: React.FC<Props> = ({ quizId }) => {
  // State to manage option inputs dynamically
  const [options, setOptions] = useState([
    { optionText: "", isCorrect: false },
  ]);
  const [category, setCategory] = useState<string | null>("Multiple");
  const [points, setPoints] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const questionData: any = {
      text: formData.get("text") as string,
      explanation: formData.get("explanation") as string,
      category: category,
      quizId: quizId,
      optionRequests: options,
      points: parseInt(points, 10) || 0,
    };

    if (photo) {
      // Convert photo to Base64 string
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Extract only the Base64 part of the data URL
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // This removes the data URL scheme and keeps only Base64 data

        questionData.photoBase64 = base64Data;
        console.log(base64Data);  // Logging the Base64 string for verification

        try {
          await axios.post(`${API_URL}/Question/AddNewQuestion`, questionData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          });
          window.location.reload();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Question creation failed.", error.response?.status);
          } else {
            console.error("Error during Axios request:", error);
          }
        }
      };
      reader.readAsDataURL(photo);
    } else {
      // Proceed without photo
      try {
        await axios.post(`${API_URL}/Question/AddNewQuestion`, questionData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        window.location.reload();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Question creation failed.", error.response?.status);
        } else {
          console.error("Error during Axios request:", error);
        }
      }
    }
  };


  const handleOptionChange = (
    index: number,
    field: keyof (typeof options)[number],
    value: string | boolean
  ) => {
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionText: "", isCorrect: false }]);
  };

  const removeOption = () => {
    setOptions(options.slice(0, -1)); // Remove the last option
  };

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    setCategory(newCategory);

    if (newCategory === "Word") {
      setOptions([{ optionText: "", isCorrect: true }]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPhoto(file);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="text"
              label="Klausimas"
              name="text"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="explanation"
              label="Klausimo paaiškinimas"
              name="explanation"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="points"
              label="Taškai"
              name="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              inputProps={{ min: "0" }} // This ensures that the input accepts only non-negative numbers
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="file"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                accept: "image/*",
              }}
              InputProps={{
                onChange: handleFileChange,
              }}
              label="Pridėti nuotrauką (neprivaloma)"
              name="photo"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Klausimo Tipas</Typography>
            <ToggleButtonGroup
              color="primary"
              value={category}
              exclusive
              onChange={handleCategoryChange}
              fullWidth
            >
              <ToggleButton value="Multiple">Keli teisingi</ToggleButton>
              <ToggleButton value="One">Tik vienas teisingas</ToggleButton>
              <ToggleButton value="Word">Atviras</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography>
              {category === "Word" ? "Atsakymas:" : "Atsakymai:"}
            </Typography>
          </Grid>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              <Grid item xs={category === "Word" ? 12 : 10}>
                <TextField
                  fullWidth
                  label={`Atsakymas ${index + 1}`}
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(index, "optionText", e.target.value)
                  }
                />
              </Grid>
              {category !== "Word" && (
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Teisingas?"
                    select
                    value={String(option.isCorrect)}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        "isCorrect",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Taip</MenuItem>
                    <MenuItem value="false">Ne</MenuItem>
                  </TextField>
                </Grid>
              )}
            </React.Fragment>
          ))}

          {category !== "Word" && (
            <React.Fragment>
              <Grid item xs={6}>
                <Button onClick={addOption} variant="outlined" fullWidth>
                  Pridėti atsakymą
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={removeOption}
                  variant="outlined"
                  fullWidth
                  disabled={options.length <= 1}
                >
                  Panaikinti atsakymą
                </Button>
              </Grid>
            </React.Fragment>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sukurti klausimą
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QuestionForm;

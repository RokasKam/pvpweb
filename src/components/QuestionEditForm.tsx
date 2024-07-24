import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  MenuItem,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";

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
  optionResponses: Option[];
  points: number;
}

interface Props {
  question: Question;
  open: boolean;
  onClose: () => void;
  onSave: (updatedQuestionId: string) => void;
}

const QuestionEditForm: React.FC<Props> = ({
  question,
  open,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState(question.text);
  const [explanation, setExplanation] = useState(question.explanation);
  const [options, setOptions] = useState([
    { optionText: "", isCorrect: false },
  ]);
  const [points, setPoints] = useState(question.points.toString());
  const [category, setCategory] = useState<string | null>(question.category);
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState(question.imageURL || null);

  useEffect(() => {
    if (!question.optionResponses) {
      console.error(
        "Invalid question data: options array is missing",
        question
      );
    }
    const formattedOptions = question.optionResponses.map((option) => ({
      optionText: option.optionText,
      isCorrect: option.isCorrect,
    }));
    setOptions(formattedOptions);
  }, [question]);

  const handleSubmit = async () => {
    const updatedQuestion: any = {
      id: question.id,
      text: text,
      points: parseInt(points, 10),
      explanation: explanation,
      category: category as "Multiple" | "One" | "Word", // Assuming category is one of these values.
      imageURL: imageURL,
      quizId: question.quizId,
      optionRequests: options
    };
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];

        updatedQuestion.imageURL = base64Data;

        try {
          await axios.put(`${API_URL}/Question/UpdateQuestion`, updatedQuestion, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          onSave(question.id);
          onClose();
        } catch (error) {
          console.error("Failed to update question:", error);
        }
      };
      reader.readAsDataURL(photo);
    } else {
      try {
        await axios.put(`${API_URL}/Question/UpdateQuestion`, updatedQuestion, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        onSave(question.id);
        onClose();
      } catch (error) {
        console.error("Failed to update question:", error);
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
  const handleImageDelete = () => {
    setImageURL(null);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">Edit Question</DialogTitle>
      <DialogContent style={{ minHeight: "500px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingTop: "30px"}}>
            <TextField
              required
              label="Klausimas"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Klausimo paaiškinimas"
              fullWidth
              multiline
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Taškai"
              type="number"
              fullWidth
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              inputProps={{ min: "0" }}
            />
          </Grid>
          {imageURL && (
            <Grid item xs={12}>
              <Typography>Klausimo nuotrauka:</Typography>
              <CardMedia
                component="img"
                sx={{ objectFit: "cover", width: "30%", maxHeight: 200, marginBottom: 2 }}
                image={imageURL}
                alt="Question Image"
              />
              <Button variant="outlined" onClick={handleImageDelete}>
                Ištrinti nuotruaką
              </Button>
            </Grid>
          )}
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
              label={imageURL ? "Pakeisti nuotrauką" : "Pridėti nuotrauką (neprivaloma)"}
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
        </Grid>

      
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionEditForm;

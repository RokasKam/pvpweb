import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import logo from "../image_with_tagline.png";

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
        <Box
          component="img"
          sx={{
            height: 340,
            width: 340,
          }}
          alt="Logo"
          src={logo}
        />
      </Box>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80%' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                „Sveikutis“
              </Typography>
              <Typography variant="body1">
                Lengvai įvertinkite ir įtraukite mokinius, vizualizuodami
                mokymosi pažangą realiuoju laiku ir gaudami momentinius
                rezultatus.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80%' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Taupykite laiką
              </Typography>
              <Typography variant="body1">
                „Sveikutis“ klausimynus lengva sukurti. Kurkite ir naudokite juos
                tiek kartų, kiek reikia. Kadangi jie vertinami automatiškai
                realiuoju laiku, mažiau laiko skirsite užduotims vertinti, o
                daugiau - grupės poreikiams tenkinti.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom align="center">
            Mokiniams
          </Typography>
          <Typography variant="body1" align="center">
            „Sveikutis“ programėlę mokiniai gali naudotis 100 % nemokamai visuose
            įrenginiuose.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;

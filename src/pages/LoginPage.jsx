import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import LoginFormSection from "../sections/LoginFormSection";
import backgroundImg from "@images/bazaar.png";

const LoginPage = () => {
  useEffect(() => {
    document.body.classList.add("login-background");

    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        maxWidth: 1000,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 5,
        backgroundColor: '#fff',
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 200, md: "auto" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 1,
          },
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            textAlign: "center",
            p: 30,
          }}
        ></Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(8px)",
          p: { xs: 3, md: 6 },
        }}
      >
        <LoginFormSection />
      </Box>
    </Box>
  );
};

export default LoginPage;

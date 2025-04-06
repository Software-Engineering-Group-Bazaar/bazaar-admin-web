import React, { useEffect } from "react";
import { Box } from "@mui/material";
import LoginFormSection from "../sections/LoginFormSection";
import backgroundImg from "@images/Bazaar.png";

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
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1000,
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#fff",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Lijevi box sa slikom */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "cover", // ✅ pun ekran bez bijelih praznina
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
              backgroundColor: "rgba(0, 0, 0, 0.4)", // ✅ tamni overlay
              zIndex: 1,
            },
            zIndex: 0,
          }}
        />

        {/* Desni box sa formom */}
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
    </Box>
  );
};

export default LoginPage;

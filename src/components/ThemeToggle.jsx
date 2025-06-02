import React from "react";
import { Box, Typography } from "@mui/material";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <Box
      onClick={toggleTheme}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 160,
        height: 50,
        borderRadius: 999,
        bgcolor: isDark ? "#1e293b" : "#e0f7fa",
        p: "0 12px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* Tekst: Light */}
      <Typography
        sx={{
          color: !isDark ? "#000" : "#fff",
          fontSize: 12,
          fontWeight: 500,
          zIndex: 1,
        }}
      >
        Light
      </Typography>

      {/* Tekst: Dark */}
      <Typography
        sx={{
          color: isDark ? "#fff" : "#000",
          fontSize: 12,
          fontWeight: 500,
          zIndex: 1,
        }}
      >
        Dark
      </Typography>

      {/* Klizeća ikona */}
      <Box
        sx={{
          position: "absolute",
          top: "5px",
          left: isDark ? "calc(100% - 45px)" : "5px",
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: isDark ? "#334155" : "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 2,
          transition: "all 0.3s ease",
          zIndex: 2,
        }}
      >
        {isDark ? (
          <Moon size={18} color="#facc15" />
        ) : (
          <Sun size={18} color="#f59e0b" />
        )}
      </Box>
    </Box>
  );
};

export default ThemeToggle;

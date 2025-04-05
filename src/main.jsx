import React, { StrictMode } from "react";
import AppRoutes from "@routes/Router";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@styles/theme";
import "./App.css";
import "./index.css";
import { PendingUsersProvider } from "./context/PendingUsersContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PendingUsersProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </PendingUsersProvider>
  </StrictMode>
);

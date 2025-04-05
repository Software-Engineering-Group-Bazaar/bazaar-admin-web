import "./App.css";
import LoginPage from "@pages/LoginPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import UsersManagement from "@pages/UsersManagement.jsx";
import Sidebar from "@components/Sidebar";
import { Box } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem' }}>
          <UsersManagement />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

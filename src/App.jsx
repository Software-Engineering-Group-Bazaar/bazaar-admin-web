import './App.css';
import LoginPage from "@pages/LoginPage";
import { ThemeProvider } from '@mui/material/styles';
import theme from '@styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import UserManagement from "./sections/UserManagementSection.jsx";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserManagement />
    </ThemeProvider>
  );
}

export default App;

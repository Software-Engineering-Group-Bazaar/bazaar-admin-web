import './App.css'
import LoginPage from "@pages/LoginPage"
import {  ThemeProvider } from '@mui/material/styles';
import theme from '@styles/theme'; 
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline />
    <LoginPage/>
    </ThemeProvider>
  )
}

export default App

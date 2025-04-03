// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3C5B66',      
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D7A151',     
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#923330',     
    },
    text: {
      primary: '#4D1211',  
      secondary: '#3C5B66',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 5,
  },
});

export default theme;

import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
  },
  overrides: {
    body: {
      margin: 0,
    },
  },
});
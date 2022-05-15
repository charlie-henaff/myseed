import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffab40',
    },
    info: {
      main: '#448aff',
    },
    success: {
      main: '#69f0ae',
    },
  },
  overrides: {
    body: {
      margin: 0
    },
  },
});
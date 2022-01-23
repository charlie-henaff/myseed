import {createTheme} from '@mui/material/styles';

export default createTheme({
    palette: {
      background: {
        default: '#303030',
      },
      primary: {
        main: 'rgba(41,41,41,0)',
      },
      secondary: {
        main: '#f50057',
      },
      divider: 'rgba(255,255,255,0.11)',
    },
    overrides: {
      body: {
        margin: 0,
      },
    },
});
import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    MuiStepIcon: {
      root: {
        '&$completed': {
          color: '#946846',
        },
        '&$active': {
          color: '#946846',
        },
      }
    },
  },
  palette: {
    primary: {
      light: '#0A2239',
      main: '#040F0F',
    },
    secondary: {
      main: '#946846',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFFFFF',
    },
    highlight: {
      main: '#136F63',
    }
  },
});

export default theme;
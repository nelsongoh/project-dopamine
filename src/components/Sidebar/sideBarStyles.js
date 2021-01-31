import { makeStyles } from '@material-ui/core/styles';

const normDrawerWidth = 240;
const smallDrawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.down('sm')]: {
      width: smallDrawerWidth,
      flexShrink: 0,
    },
    [theme.breakpoints.up('md')]: {
      width: normDrawerWidth,
      flexShrink: 0,
    },
  },

  drawerPaper: {
    [theme.breakpoints.down('sm')]: {
      width: smallDrawerWidth,
    },
    [theme.breakpoints.up('md')]: {
      width: normDrawerWidth,
    },
  },

  drawerContainer: {
    overflow: 'auto',
  },
}));

export default useStyles;

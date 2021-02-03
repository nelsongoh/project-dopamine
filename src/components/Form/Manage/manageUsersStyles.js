import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    height: "80vh",
    width: "100%",
  },

  flexContainer: {
    display: "flex",
    height: "100%",
  },

  flexGrowDiv: {
    flexGrow: 1,
  },

  accEnabled: {
    borderColor: "green",
    color: "green",
  },

  accDisabled: {
    borderColor: "red",
    color: "red",
  },
}));

export default useStyles;

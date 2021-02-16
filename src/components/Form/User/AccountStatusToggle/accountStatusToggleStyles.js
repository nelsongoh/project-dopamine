import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  accEnabled: {
    fontWeight: 600,
    color: "green",
  },

  accDisabled: {
    fontWeight: 600,
    color: "red",
  },
}));

export default useStyles;

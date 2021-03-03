import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  stepContent: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export default useStyles;

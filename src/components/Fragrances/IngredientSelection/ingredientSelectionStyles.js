import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  chip: {
    marginLeft: theme.spacing(2),
  },
  unEmphasizedText: {
    color: "lightgrey"
  },
}));

export default useStyles;

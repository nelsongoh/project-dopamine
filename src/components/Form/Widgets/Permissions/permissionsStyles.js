import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  perms: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    float: 'right',
    position: 'relative',
    padding: theme.spacing(3),
  },

  permsSection: {
    marginTop: '1em',
    marginBottom: '1em',
  },
}));

export default useStyles;

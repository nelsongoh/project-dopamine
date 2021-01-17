import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Content from '../../lang';
import useStyles from './headerbarStyles';
import LoginWidget from './Widgets/Login';

const Headerbar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar position="static">
          <Typography variant="h4" className={classes.title}>{Content('en').title}</Typography>
          <LoginWidget />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
};

export default Headerbar;
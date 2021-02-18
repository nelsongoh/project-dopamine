import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Content from '../../lang';
import useStyles from './headerbarStyles';
import LoginWidget from './Widgets/Login';

const Headerbar = ({ isTopStack = false, toggleSidebar = null }) => {
  const classes = useStyles();
  const stackIdx = isTopStack ? classes.topStack : classes.normStack;

  return (
    <div className={classes.root}>
      <AppBar id="headerbar" className={stackIdx}>
        <Toolbar position="static">
          <IconButton
            color="inherit"
            aria-label={Content('en').headerbar.menuBtn.ariaLabel}
            className={classes.menuBtn}
            onClick={toggleSidebar}
            edge="start"
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h4" className={classes.title}>{Content('en').headerbar.title}</Typography>
          <LoginWidget />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
};

export default Headerbar;
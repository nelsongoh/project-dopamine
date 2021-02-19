import Router from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Content from '@/content';
import useStyles from './headerbarStyles';
import LoginWidget from '@/components/Headerbar/Widgets/Login';
import routes from '../../routes';

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
          <Button
            color="inherit"
            onClick={() => {Router.push(routes.index)}}
          >
            <Typography variant="h4" className={classes.title}>{Content('en').headerbar.title}</Typography>
          </Button>
          <div className={classes.grow} />
          <LoginWidget />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
};

export default Headerbar;
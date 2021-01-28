import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useStyles from './sideBarStyles';
import Link from '../Link';

const Sidebar = ({ content }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {content.map((text, idx) => (
              <ListItem button component={Link} href={`/dashboard/${text.toLowerCase()}`} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
    </Drawer>
  )
};

export default Sidebar;

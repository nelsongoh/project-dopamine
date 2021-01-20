import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useStyles from './sideBarStyles';

const Sidebar = ({ content }) => {
  const classes = useStyles();

  console.log(content);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
    >
      <Toolbar />
        <List>
          {content.map((text, idx) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
    </Drawer>
  )
};

export default Sidebar;

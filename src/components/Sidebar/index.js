import { Fragment } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useStyles from './sideBarStyles';
import Link from '../Link';
import routes from '../../routes';

const Sidebar = ({ content, type, open, onClose, container }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant={type === "mobile" ? "temporary" : "permanent"}
      open={type === "mobile" ? open : true}
      onClose={type === "mobile" ? onClose : null}
      classes={{ paper: classes.drawerPaper }}
      container={container}
      ModalProps={{
        keepMounted: type === "mobile" ? true : false,
      }}
    >
      <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {content.map((permission) => (
              routes.protected[permission].sublinks.length > 0 ?
                (
                  <Fragment key={Math.random()}>
                    <ListItem>
                      <ListItemText primary={routes.protected[permission].title}/>
                    </ListItem>
                    {(routes.protected[permission].sublinks).map((sublink) => (
                      <ListItem button component={Link} href={`${sublink.url}`} key={Math.random()} className={classes.subLink}>
                        <ListItemText primary={sublink.title} />
                      </ListItem>
                    ))}
                  </Fragment>
                ) : (
                  <ListItem button component={Link} href={`${routes.protected[permission].url}`} key={Math.random()}>
                    <ListItemText primary={routes.protected[permission].title} />
                  </ListItem>
                )
            ))}
          </List>
        </div>
    </Drawer>
  )
};

export default Sidebar;

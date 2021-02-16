import { Fragment, useContext, useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoginContext from '../../contexts/login';
import PermissionsContext from '../../contexts/permissions';
import useStyles from './sideBarStyles';
import Link from '../Link';
import LoadingScreen from '../Loading/loading';
import Content from '../../lang';

const Sidebar = ({ type, open, onClose, container }) => {
  const classes = useStyles();
  const { isAdmin } = useContext(LoginContext);
  const { permissions } = useContext(PermissionsContext);
  
  return (
    <Fragment>
      {
        (permissions === null || permissions.length === 0) ? (
          <LoadingScreen isOpen={true} />
        ) : (
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
                {permissions.filter((perm) => perm.type !== "admin")
                  .map((permDetails) => (
                    <ListItem button component={Link} href={`${permDetails.url}`} key={Math.random()}>
                      <ListItemText primary={permDetails.title} />
                    </ListItem>
                  ))
                }
                {isAdmin ? (
                  <Fragment key={Math.random()}>
                    <ListItem>
                      <ListItemText primary={Content('en').sidebar.admin.title}/>
                    </ListItem>
                    {permissions.filter((perm) => perm.type === "admin")
                      .map((permDetails) => (
                        <ListItem button component={Link} href={permDetails.url} key={Math.random()} className={classes.subLink}>
                          <ListItemText primary={permDetails.title} />
                        </ListItem>
                      ))}
                  </Fragment>
                ) : (
                  null
                )}
              </List>
            </div>
          </Drawer>
        )
      }
    </Fragment>
  );
};

export default Sidebar;

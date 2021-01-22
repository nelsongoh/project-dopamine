import { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Router from 'next/router';
import Link from '../../../Link';
import { signOutUser } from '../../../Auth/FirebaseAuth';
import Content from '../../../../lang';

const LoginProfileButton = () => {
  const [anchorEle, setAnchorEle] = useState(null);
  const isMenuOpen = Boolean(anchorEle);

  const openMenu = (event) => {
    setAnchorEle(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEle(null);
  };

  const logout = () => {
    signOutUser();
    Router.push("/");
  }

  return (
    <div>
      <IconButton
        edge="end"
        aria-label={Content('en').headerbar.loggedInBtn.ariaLabel}
        aria-haspopup="true"
        onClick={openMenu}
        color="inherit"
      >
        <Icon style={{ fontSize: 40 }}>account_circle</Icon>
      </IconButton>
      <Menu
        anchorEl={anchorEle}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem component={Link} href="/dashboard">{Content('en').headerbar.loggedInBtn.menu.dashboard}</MenuItem>
        <MenuItem onClick={logout}>{Content('en').headerbar.loggedInBtn.menu.logout}</MenuItem>
      </Menu>
    </div>
    
  );
}

export default LoginProfileButton;

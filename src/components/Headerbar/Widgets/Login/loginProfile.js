import { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Router from 'next/router';
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
        aria-label={Content('en').login.headerbarBtn.ariaLabel}
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
        <MenuItem onClick={logout}>{Content('en').logout.title}</MenuItem>
      </Menu>
    </div>
    
  );
}

export default LoginProfileButton;

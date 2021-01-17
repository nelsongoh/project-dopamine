import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const LoginProfileButton = () => {
  return (
    <IconButton
      edge="end"
      aria-label="account of current user"
      aria-haspopup="true"
      onClick={() => {}}
      color="inherit"
    >
      <Icon style={{ fontSize: 40 }}>account_circle</Icon>
    </IconButton>
  );
}

export default LoginProfileButton;

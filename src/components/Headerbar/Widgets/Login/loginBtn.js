import Button from '@material-ui/core/Button';
import Link from '../../../Link';

const LoginButton = () => {
  return (
    <Button 
      color="inherit"
      component={Link}
      href="/login"
    >
      Login
    </Button>
  );
}

export default LoginButton;

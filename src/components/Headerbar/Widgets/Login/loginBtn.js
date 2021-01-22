import Button from '@material-ui/core/Button';
import Link from '../../../Link';
import Content from '../../../../lang';

const LoginButton = () => {
  return (
    <Button 
      color="inherit"
      component={Link}
      href="/login"
    >
      {Content('en').headerbar.loginBtn.title}
    </Button>
  );
}

export default LoginButton;

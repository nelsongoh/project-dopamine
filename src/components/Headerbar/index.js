import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Content from '../../lang';

const Headerbar = () => {
  return (
    <div>
      <AppBar>
        <Toolbar position="static">
          <Typography variant="h4">{Content('en').title}</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
};

export default Headerbar;
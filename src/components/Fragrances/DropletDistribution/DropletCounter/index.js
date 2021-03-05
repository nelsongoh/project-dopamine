import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './dropletCounterStyles';

const DropletCounter = ({ 
  ingredientName, dropletCount, updateDropletCount 
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.cardDisplay}>
      <CardContent>
        <Typography variant="subtitle1">This is a really long test</Typography>
      </CardContent>
      <Divider />
      <CardActions
        className={classes.controls}
      >
        <IconButton
          onClick={() => {}}
        >
          <Icon>remove</Icon>
        </IconButton>
        <TextField
          className={classes.text}
          size="small"
          variant="outlined"
          value="478"
        />
        <IconButton
          onClick={() => {}}
        >
          <Icon>add</Icon>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default DropletCounter;

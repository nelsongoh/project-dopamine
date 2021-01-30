import Icon from '@material-ui/core/Icon';
import useStyles from './profileImageStyles';

const ProfileImage = () => {
  const classes = useStyles();

  return (
    <Icon color="primary" className={classes.profileImg}>
      account_circle
    </Icon>
  )
};

export default ProfileImage;

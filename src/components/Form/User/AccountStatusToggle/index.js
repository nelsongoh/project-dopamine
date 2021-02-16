import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Content from '../../../../lang';
import useStyles from './accountStatusToggleStyles';

const AccountStatusToggle = ({ isEnabled, toggleStatus }) => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" justify="center" spacing={2}>
      <Grid item>
        <Typography className={!isEnabled ? classes.accDisabled : null}>
          {Content('en').pages.admin.users.manage.editUserDialog.accStatusDisabledTitle}
        </Typography>
      </Grid>
      <Grid item>
        <Switch
          color="primary"
          checked={isEnabled}
          onChange={toggleStatus}
          inputProps={{
            'aria-label': Content('en').pages.admin.users.manage.editUserDialog.accStatusAriaLabel,
          }}
        />
      </Grid>
      <Grid item>
        <Typography className={isEnabled ? classes.accEnabled : null}>
          {Content('en').pages.admin.users.manage.editUserDialog.accStatusEnabledTitle}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AccountStatusToggle;
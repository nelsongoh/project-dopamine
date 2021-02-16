import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useStyles from './userFormStyles';
import Content from '../../../lang';
import UserPermissions from '../../Form/Widgets/Permissions';
import AccountStatusToggle from './AccountStatusToggle';

const UserForm = ({ 
  userDetails, updateFirstName, updateLastName, updateEmail,
  updatePermissions, toggleAccStatus, clearForm, submitForm,
  isCancelDisabled, isSubmitDisabled, errors, clearPermissionsToggle,
  setMaxWidth = false, existingPerms,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.formDiv}
      spacing={3}
    > 
      <Grid container item md={setMaxWidth ? 12 : 6} spacing={isMobileView ? 3 : 0}>
        <Grid xs={12} md={6} item>
          <TextField
            variant="outlined"
            label={Content('en').pages.admin.users.create.fields.firstName}
            value={userDetails.firstName}
            onChange={updateFirstName}
            error={errors.firstName.hasError}
            helperText={errors.firstName.errorMsg}
            fullWidth
            className={classes.halfWidthLeftField}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <TextField
            variant="outlined"
            label={Content('en').pages.admin.users.create.fields.lastName}
            value={userDetails.lastName}
            onChange={updateLastName}
            error={errors.lastName.hasError}
            helperText={errors.lastName.errorMsg}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container item md={setMaxWidth ? 12 : 6}>
        <TextField
          variant="outlined"
          label={Content('en').pages.admin.users.create.fields.email}
          value={userDetails.email}
          onChange={updateEmail}
          error={errors.email.hasError}
          helperText={errors.email.errorMsg}
          fullWidth
        />
      </Grid>
      <Grid container item md={setMaxWidth ? 12 : 6} justify="center">
        <UserPermissions
          existingPerms={existingPerms}
          updatePermissions={updatePermissions}
          clearPermissionsToggle={clearPermissionsToggle} 
        />
      </Grid>
      <Grid container item md={setMaxWidth ? 12 : 6}>
        <AccountStatusToggle
          isEnabled={userDetails.isEnabled}
          toggleStatus={toggleAccStatus}
        />
      </Grid>
      <Grid container item md={setMaxWidth ? 12 : 6} justify="center">
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={clearForm}
          disabled={isCancelDisabled}
        >
          {Content('en').pages.admin.users.create.btns.cancel}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={submitForm}
          disabled={isSubmitDisabled}
        >
          {Content('en').pages.admin.users.create.btns.submit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserForm;

import { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import useStyles from './registerStyles';
import Content from '../../../lang';
import UserPermissions from '../Widgets/Permissions';
import { RegisterUser, RegisterUserErrors } from '../../../models/register';
import { useCreateUser } from '../../../../lib/client/useUsers';
import LoginContext from '../../../contexts/login';
import { validateAdminCreateUser } from '../../../../utils/validation/form';

const RegisterNewUser = () => {
  const classes = useStyles();
  const { user } = useContext(LoginContext);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [regUserDetails, setRegUserDetails] = useState(RegisterUser());
  const handleUpdateFirstName = (event) => {
    setRegUserDetails({...regUserDetails, firstName: event.target.value});
  };
  const handleUpdateLastName = (event) => {
    setRegUserDetails({...regUserDetails, lastName: event.target.value});
  };
  const handleUpdateEmail = (event) => {
    setRegUserDetails({...regUserDetails, email: event.target.value});
  };
  const setSelectedPermissions = (permsList) => {
    setRegUserDetails({...regUserDetails, permissions: permsList});
  }

  const [errorMsgs, setErrorMsgs] = useState(RegisterUserErrors());

  const clearForm = () => {
    setRegUserDetails(RegisterUser());
    setErrorMsgs(RegisterUserErrors());
  };

  const [isBtnsDisabled, setIsBtnsDisabled] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const submitForm = async () => {
    setIsBtnsDisabled(true);
    const outcome = await useCreateUser(user, regUserDetails);
    setIsBtnsDisabled(false);

    // If the creation was a success, 
    // display the Snackbar and clear the form
    if (outcome.success === true) {
      setIsSnackbarOpen(true);
      clearForm();
    } else {
      // We display the errors accordingly
      setErrorMsgs({...errorMsgs, ...outcome.errors});
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.formDiv}
      spacing={3}
    >
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success">
          {Content('en').pages.admin.users.create.snackbar.success}
        </Alert>
      </Snackbar>
      <Grid container item md={6} spacing={isMobileView ? 3 : 0}>
        <Grid xs={12} md={6} item>
          <TextField 
            variant="outlined"
            label={Content('en').pages.admin.users.create.fields.firstName}
            value={regUserDetails.firstName}
            onChange={handleUpdateFirstName}
            error={errorMsgs.firstName.hasError}
            helperText={errorMsgs.firstName.errorMsg}
            fullWidth
            className={classes.halfWidthLeftField}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <TextField 
            variant="outlined"
            label={Content('en').pages.admin.users.create.fields.lastName}
            value={regUserDetails.lastName}
            onChange={handleUpdateLastName}
            error={errorMsgs.lastName.hasError}
            helperText={errorMsgs.lastName.errorMsg}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container item md={6}>
        <TextField 
          variant="outlined"
          label={Content('en').pages.admin.users.create.fields.email}
          value={regUserDetails.email}
          onChange={handleUpdateEmail}
          error={errorMsgs.email.hasError}
          helperText={errorMsgs.email.errorMsg}
          fullWidth
        />
      </Grid>
      <Grid container item md={6} justify="center">
        <UserPermissions updatePermissions={setSelectedPermissions} />
      </Grid>
      <Grid container item md={6} justify="center">
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={clearForm}
          disabled={isBtnsDisabled}
        >
          {Content('en').pages.admin.users.create.btns.cancel}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={submitForm}
          disabled={isBtnsDisabled || !validateAdminCreateUser(regUserDetails)}
        >
          {Content('en').pages.admin.users.create.btns.submit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default RegisterNewUser;

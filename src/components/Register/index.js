import { Fragment, useContext, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Content from '../../lang';
import { User, UserErrors } from '../../models/register';
import { useCreateUser } from '../../../lib/client/useUsers';
import LoginContext from '../../contexts/login';
import { validateAdminCreateUser } from '../../../utils/validation/form';
import UserForm from '../Form/User';

const RegisterNewUser = () => {
  const { user } = useContext(LoginContext);
  
  const [regUserDetails, setRegUserDetails] = useState(User());
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

  const [errorMsgs, setErrorMsgs] = useState(UserErrors());

  const [clearPerms, setClearPerms] = useState(true);
  const toggleClearPerms = () => {
    setClearPerms(!clearPerms);
  };

  const clearForm = () => {
    setRegUserDetails(User());
    toggleClearPerms();
    setErrorMsgs(UserErrors());
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
    <Fragment>
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success">
          {Content('en').pages.admin.users.create.snackbar.success}
        </Alert>
      </Snackbar>
      <UserForm 
        userDetails={regUserDetails}
        updateFirstName={handleUpdateFirstName}
        updateLastName={handleUpdateLastName}
        updateEmail={handleUpdateEmail}
        updatePermissions={setSelectedPermissions}
        clearForm={clearForm}
        submitForm={submitForm}
        isCancelDisabled={isBtnsDisabled}
        isSubmitDisabled={isBtnsDisabled || !validateAdminCreateUser(regUserDetails)}
        clearPermissionsToggle={clearPerms}
        errors={errorMsgs}
      />
    </Fragment>
  );
};

export default RegisterNewUser;
import { Fragment, useContext, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Content from '@/content';
import { User, UserErrors } from '@/models/register';
import { useCreateUser } from '@/client-lib/useUsers';
import LoginContext from '@/contexts/login';
import { isUserNonEmpty } from '@/utils/validation/form';
import { debounce } from '@/utils/common';
import UserForm from '@/components/Form/User';

const RegisterNewUser = () => {
  const { userToken } = useContext(LoginContext);
  
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
  const setSelectedPermissions = (permsObj) => {
    setRegUserDetails({...regUserDetails, permissions: permsObj});
  }
  const toggleAccountStatus = () => {
    setRegUserDetails({...regUserDetails, isEnabled: !regUserDetails.isEnabled});
  };

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
    const outcome = await useCreateUser(userToken, regUserDetails);
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
        updateFirstName={(e) => {
          debounce(handleUpdateFirstName(e))
        }}
        updateLastName={(e) => {
          debounce(handleUpdateLastName(e))
        }}
        updateEmail={(e) => {
          debounce(handleUpdateEmail(e))
        }}
        updatePermissions={setSelectedPermissions}
        toggleAccStatus={toggleAccountStatus}
        clearForm={clearForm}
        submitForm={submitForm}
        isCancelDisabled={isBtnsDisabled}
        isSubmitDisabled={isBtnsDisabled || !isUserNonEmpty(regUserDetails)}
        clearPermissionsToggle={clearPerms}
        errors={errorMsgs}
      />
    </Fragment>
  );
};

export default RegisterNewUser;

import { UserErrors } from '../../../../src/models/register';

export const isNumeric = (str) => {
  if (typeof str != "string") {
    return false; // we only process strings!
  }

  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
};

export const UserFormError = (
  errorMsgArr,
  errorKeyArr = null,
) => {
  let errors = UserErrors();

  // If no key was indicated for the UserError object
  if (errorKeyArr === null) {
    if (Array.isArray(errorMsgArr) && errorMsgArr.length > 0) {
      // We override all the error messages with the provided error message
      errors.email.hasError = true;
      errors.email.errorMsg = errorMsg;
      errors.firstName.hasError = true;
      errors.firstName.errorMsg = errorMsg;
      errors.lastName.hasError = true;
      errors.lastName.errorMsg = errorMsg;
    }
  } else {
    if (Array.isArray(errorMsgArr) && Array.isArray(errorKeyArr)) {
      if (errorMsgArr.length === errorKeyArr.length) {
        let isAllErrorKeysValid = errorKeyArr.every((errorKey) => (
          Object.hasOwnProperty.call(errors, errorKey)
        ));
        
        if (isAllErrorKeysValid) {
          for (let i = 0; i < errorMsgArr.length; i += 1) {
            errors[errorKeyArr[i]].hasError = true;
            errors[errorKeyArr[i]].errorMsg = errorMsgArr[i];
          }
        }
      }
    }    
  }

  return errors;
};

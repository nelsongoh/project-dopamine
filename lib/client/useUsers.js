import axios from 'axios';
import { cloneDeep } from 'lodash/lang';

export const useUpdateUser = async (userToken, data) => {
  const shouldFetch = typeof(userToken) === null ? false : true;
  if (shouldFetch) {
    try {
      await axios.patch(`/api/admin/users`, {
        data: {...data, userToken}
      });

      return { success: true };
    } catch (error) {
      console.log("Error with updating the user from the admin panel.");
      return {
        success: false,
        errors: error.response.data,
      }
    }
  }
};

export const useCreateUser = async (userToken, data) => {
  const shouldFetch = typeof(userToken) === null ? false : true;  
  if (shouldFetch) {
    try {
      // We transform the Set of page permissions to an array
      // since Sets can't be sent via API calls
      let dataToSend = cloneDeep(data);
      dataToSend.permissions.pages = [...dataToSend.permissions.pages];

      await axios.post(`/api/admin/users`, {
        data: {...dataToSend, userToken}
      });

      return { success: true };
    } catch (error) {
      console.log("Error with creating a new user from the admin panel.");
      console.log(error.response.data);
      return {
        success: false,
        errors: error.response.data,
      };
    }
  }
};

export const useGetUsers = async (userToken, nextPageToken, numUsers) => {
  const shouldFetch = typeof(userToken) === null ? false : true;
  let fetchUrl = `/api/admin/users/${userToken}`;
  
  if (typeof(nextPageToken) !== "undefined" && typeof(numUsers) !== "undefined") {
    fetchUrl = `/api/admin/users/${userToken}?npt=${nextPageToken}&userLimit=${numUsers}`;
  } else if (typeof(numUsers) !== "undefined") {
    fetchUrl = `/api/admin/users/${userToken}?userLimit=${numUsers}`;
  } else if (typeof(nextPageToken) !== "undefined") {
    fetchUrl = `/api/admin/users/${userToken}?npt=${nextPageToken}`;
  }

  if (shouldFetch) {
    try {
      const { data } = await axios.get(fetchUrl);
      return { success: true, data };
    } catch (error) {
      return { success: false, errorMsg: error };
    }
  }
  
  return {
    success: false,
  };
};

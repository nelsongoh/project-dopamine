import axios from 'axios';

const useAvailablePermissions = async (userToken) => {
  const shouldFetch = typeof(userToken) === null ? false : true;
  if (shouldFetch) {
    try {
      const availPerms = await axios.get(`/api/admin/users/permissions/${userToken}`);
      return availPerms.data;
    } catch (error) {
      console.log("Error with retrieving the available user permissions.");
      console.log(error);
      return [];
    }
  }
};

export default useAvailablePermissions;

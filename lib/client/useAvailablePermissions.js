import axios from 'axios';

const useAvailablePermissions = async (user) => {
  const shouldFetch = typeof(user) === null ? false : true;
  if (shouldFetch) {
    try {
      const availPerms = await axios.get(`/api/admin/users/permissions/${user.uid}`);

      return availPerms.data;
    } catch (error) {
      console.log("Error with retrieving the available user permissions.");
      console.log(error);
      return [];
    }
  }
};

export default useAvailablePermissions;

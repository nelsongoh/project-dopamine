import axios from 'axios';

export const useCreateUser = async (user, data) => {
  const shouldFetch = typeof(user) === null ? false : true;
  if (shouldFetch) {
    try {
      await axios.post(`/api/admin/users`, {
        data: {...data, uid: user.uid}
      });

      return { success: true };
    } catch (error) {
      console.log("Error with creating a new user from the admin panel.");
      return {
        success: false,
        errors: error.response.data,
      };
    }
  }
};

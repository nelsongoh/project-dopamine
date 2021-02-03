import axios from 'axios';
import useSWR from 'swr';

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

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

export const useGetUsers = async (user, nextPageToken, numUsers) => {
  const shouldFetch = typeof(user) === null ? false : true;
  let fetchUrl = `/api/admin/users/${user.uid}`;
  
  if (typeof(nextPageToken) !== "undefined" && typeof(numUsers) !== "undefined") {
    fetchUrl = `/api/admin/users/${user.uid}?npt=${nextPageToken}&userLimit=${numUsers}`;
  } else if (typeof(numUsers) !== "undefined") {
    fetchUrl = `/api/admin/users/${user.uid}?userLimit=${numUsers}`;
  } else if (typeof(nextPageToken) !== "undefined") {
    fetchUrl = `/api/admin/users/${user.uid}?npt=${nextPageToken}`;
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

export const useGetUserMetadata = (user) => {
  const shouldFetch = typeof(user) === null ? false : true;
  const { data, error } = useSWR(() => shouldFetch ? `/api/admin/users/metadata/${user.uid}` : null, fetcher);

  return {
    content: data,
    isLoading: !data && !error,
    isError: error
  };
};

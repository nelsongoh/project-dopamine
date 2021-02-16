import useSWR from 'swr';

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

const useDashboardContent = (userToken) => {
  const shouldFetch = typeof(userToken) === null ? false : true;
  const { data, error } = useSWR(() => shouldFetch ? `/api/user/dashboard/${userToken}` : null, fetcher);

  return {
    content: data,
    isLoading: !data && !error,
    isError: error
  }
};

export default useDashboardContent;

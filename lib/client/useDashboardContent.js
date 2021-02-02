import useSWR from 'swr';

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

const useDashboardContent = (user) => {
  const shouldFetch = typeof(user) === null ? false : true;
  const { data, error } = useSWR(() => shouldFetch ? `/api/user/dashboard/${user.uid}` : null, fetcher);

  return {
    content: data,
    isLoading: !data && !error,
    isError: error
  }
};

export default useDashboardContent;

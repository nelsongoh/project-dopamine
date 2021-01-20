import useSWR from 'swr';

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

const useDashboardContent = (uid) => {
  const { data, error } = useSWR(`/api/user/dashboard/${uid}`, fetcher);

  return {
    content: data,
    isLoading: !data && !error,
    isError: error
  }
};

export default useDashboardContent;

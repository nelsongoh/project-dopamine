import useSWR from 'swr';

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

const useCalendarOverlay = (user, overlayData) => {
  const shouldFetch = ((typeof(user) === null) || overlayData !== null) ? false : true;
  const { data, error } = useSWR(() => shouldFetch ? `/api/user/calendar/${user.uid}` : null, fetcher);
  
  return {
    content: data,
    isLoading: !data && !error && shouldFetch,
    isError: error
  }
};

export default useCalendarOverlay;

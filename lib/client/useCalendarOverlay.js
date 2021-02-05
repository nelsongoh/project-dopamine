import useSWR from 'swr';

const fetcher = (...args) => fetch(...args)
  .then(res => res.json());

const useCalendarOverlay = (userToken, overlayData) => {
  const shouldFetch = ((typeof(userToken) === null) || overlayData !== null) ? false : true;
  const { data, error } = useSWR(() => shouldFetch ? `/api/user/calendar/${userToken}` : null, fetcher);
  
  return {
    content: data,
    isLoading: !data && !error && shouldFetch,
    isError: error
  }
};

export default useCalendarOverlay;

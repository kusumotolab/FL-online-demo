import useSWRImmutable from "swr/immutable";

import fetcher from "@/utils/fetcher";

const useTests = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(
    [new URL(`./api/test`, `http://${window.location.host}/backend/`).href, src, test],
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    testResults: data,
    error,
    isLoading: !error && !data,
  };
};

export { useTests };

import useSWRImmutable from "swr/immutable";

import fetcher from "@/utils/fetcher";

const useFL = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(
    [new URL(`./api/fl/all`, `http://${window.location.host}/backend/`).href, src, test],
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    flResults: data,
    error,
    isLoading: !error && !data,
  };
};

export { useFL };

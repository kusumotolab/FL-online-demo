import useSWRImmutable from "swr/immutable";

import fetcher from "@/utils/fetcher";

const useFL = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(
    [new URL(`./api/fl/all`, process.env.NEXT_PUBLIC_FL_API_ENDPOINT).href, src, test],
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

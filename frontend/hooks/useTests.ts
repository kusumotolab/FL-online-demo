import useSWRImmutable from "swr/immutable";

import fetcher from "@/util/fetcher";

const useTests = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(
    [new URL(`./api/test`, process.env.NEXT_PUBLIC_TEST_API_ENDPOINT).href, src, test],
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

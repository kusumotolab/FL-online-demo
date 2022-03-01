import fetcher from "../util/fetcher";
import useSWRImmutable from "swr/immutable";

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
    error: error,
    isLoading: !error && !data,
  };
};

export { useTests };

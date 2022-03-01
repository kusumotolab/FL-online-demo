import fetcher from "../util/fetcher";
import useSWRImmutable from "swr/immutable";

const useFL = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(
    [new URL(`./api/fl/all`, process.env.NEXT_PUBLIC_FL_API_ENDPOINT).href, src, test],
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    flResult: data,
    error: error,
    isLoading: !error && !data,
  };
};

export { useFL };

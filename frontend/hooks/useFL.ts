import checkFetchError from "../util/checkFetchError";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: RequestInfo, src: string, test: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src: src, test: test }),
  }).then(checkFetchError);

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

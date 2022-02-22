import checkFetchError from "../util/checkFetchError";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: RequestInfo, src: string, test: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src: src, test: test }),
  })
    .then(checkFetchError)
    .then((res) => res)
    .catch((err) => console.error(err));

const useFL = (src: string, test: string) => {
  const { data, error } = useSWRImmutable(["/api/fl/all", src, test], fetcher);

  return {
    flResult: data,
    error: error,
    isLoading: !error && !data,
  };
};

export { useFL };

import checkFetchError from "@/util/checkFetchError";

const fetcher = (url: RequestInfo, src: string, test: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src, test }),
  }).then(checkFetchError);

export default fetcher;

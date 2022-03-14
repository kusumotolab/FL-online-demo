import { components } from "@/schemas/backend";
import checkFetchError from "@/utils/checkFetchError";

const fetcher = (url: RequestInfo, { src, test }: components["schemas"]["SrcAndTests"]) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src, test }),
  }).then(checkFetchError);

export default fetcher;

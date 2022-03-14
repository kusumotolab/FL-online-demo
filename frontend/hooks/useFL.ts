import useSWRImmutable from "swr/immutable";

import { components } from "@/schemas/backend";
import fetcher from "@/utils/fetcher";

const useFL = (src: string, test: string) => {
  type FlResult = components["schemas"]["FlResult"];
  const { data, error } = useSWRImmutable<FlResult[]>(
    [new URL("./api/fl/all", `http://${window.location.host}/backend/`).href, { src, test }],
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

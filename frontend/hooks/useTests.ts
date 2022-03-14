import { Key } from "swr";
import useSWRImmutable from "swr/immutable";

import { components } from "@/schemas/backend";
import fetcher from "@/utils/fetcher";

const useTests = (src: string, test: string) => {
  type TestResultWithCoverage = components["schemas"]["TestResultWithCoverage"];
  const { data, error } = useSWRImmutable<TestResultWithCoverage[]>(
    [new URL(`./api/test`, `http://${window.location.host}/backend/`).href, { src, test }],
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

import useSWRImmutable from "swr/immutable";

import { components } from "@/schemas/backend";
import fetcher from "@/utils/fetcher";
import isUndefined from "@/utils/isUndefined";

type TestResultWithCoverageType = components["schemas"]["TestResultWithCoverage"];
const useTest = (src: string | undefined, test: string | undefined) => {
  const { data, error } = useSWRImmutable<TestResultWithCoverageType[]>(
    [
      isUndefined(window) || isUndefined(src) || isUndefined(test)
        ? undefined
        : new URL(
            "./api/test",
            `${window.location.protocol}//${window.location.host}${window.location.pathname}/backend/`,
          ).href,
      { src, test },
    ],
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
};

export type { TestResultWithCoverageType };
export { useTest };

import useSWRImmutable from "swr/immutable";

import { components } from "@/schemas/backend";
import fetcher from "@/utils/fetcher";
import isUndefined from "@/utils/isUndefined";

type FaultLocalizationResultType = components["schemas"]["FlResult"];
const useFaultLocalization = (src: string | undefined, test: string | undefined) => {
  const { data, error } = useSWRImmutable<FaultLocalizationResultType[]>(
    [
      isUndefined(window) || isUndefined(src) || isUndefined(test)
        ? undefined
        : new URL(
            "./api/fl/all",
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

export type { FaultLocalizationResultType };
export { useFaultLocalization };

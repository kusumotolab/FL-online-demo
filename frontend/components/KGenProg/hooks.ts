import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useSWRImmutable from "swr/immutable";

import fetcher from "@/utils/fetcher";
import isUndefined from "@/utils/isUndefined";

const useKGenProg = (
  src: string | undefined,
  test: string | undefined,
  abortController?: AbortController,
) => {
  const defaultKgpMessage: MessageEvent[] = [];
  const [kgpMessage, setKgpMessage] = useState(defaultKgpMessage);

  const [isAbort, setIsAbort] = useState(false);
  const [isError, setIsError] = useState(false);

  const { data: submission, error: submissionError } = useSWRImmutable(
    [
      isUndefined(window) || isUndefined(src) || isUndefined(test)
        ? undefined
        : new URL(
            "./api/submission",
            `${window.location.protocol}//${window.location.host}${window.location.pathname}/kdemo/`,
          ).href,
      { src, test },
    ],
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      setKgpMessage(defaultKgpMessage);
      abortController?.signal?.addEventListener("abort", () => {
        setSocketUrl(null);
      });
    },
    onClose: () => {
      setIsAbort(socketUrl === null);
      setIsError(false);
    },
    onError: () => {
      setIsAbort(false);
      setIsError(true);
    },
    retryOnError: false,
  });

  useEffect(() => {
    const key = submission?.key ?? null;
    const url =
      key === null
        ? null
        : new URL(
            `./${key}`,
            `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${
              window.location.pathname
            }/kdemo/`,
          ).href;

    setSocketUrl(url ?? null);
  }, [submission]);

  useEffect(() => {
    if (lastMessage !== null) {
      setKgpMessage((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setKgpMessage]);

  const data = kgpMessage.length === 0 ? undefined : kgpMessage;
  const error = submissionError || isError;
  return {
    data,
    error,
    isLoading: !error && !isAbort && readyState !== ReadyState.CLOSED,
    isAbort,
  } as const;
};

export { useKGenProg };

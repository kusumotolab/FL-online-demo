import checkFetchError from "../util/checkFetchError";
import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const useKGenProg = ({
  onStart,
  onSuccess,
  onError,
}: {
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const defaultMessageHistory: MessageEvent[] = [];

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [messageHistory, setMessageHistory] = useState(defaultMessageHistory);
  const { lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => setMessageHistory(defaultMessageHistory),
    onClose: onSuccess,
    onError: onError,
    retryOnError: false,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const assignRun = useCallback(
    (src: string, test: string) => {
      if (typeof onStart !== "undefined") onStart();

      const data = { src: src, test: test };

      fetch(new URL("./api/submission", process.env.NEXT_PUBLIC_REPAIR_API_ENDPOINT).href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(checkFetchError)
        .then((text) =>
          setSocketUrl(new URL(`./${text.key}`, process.env.NEXT_PUBLIC_REPAIR_WS_ENDPOINT).href),
        )
        .catch(onError);
    },
    [onStart, onError],
  );

  return { messageHistory, runKgp: assignRun } as const;
};

export { useKGenProg };

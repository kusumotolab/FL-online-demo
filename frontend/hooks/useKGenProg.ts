import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

import checkFetchError from "@/utils/checkFetchError";

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
    onError,
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

      const data = { src, test };

      fetch(new URL("./api/submission", `http://${window.location.host}/kdemo/`).href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(checkFetchError)
        .then((text) =>
          setSocketUrl(new URL(`./${text.key}`, `ws://${window.location.host}/kdemo/`).href),
        )
        .catch(onError);
    },
    [onStart, onError],
  );

  return { messageHistory, runKgp: assignRun } as const;
};

export { useKGenProg };

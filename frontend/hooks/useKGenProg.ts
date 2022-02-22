import checkFetchError from "../util/checkFetchError";
import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const useKGenProg = ({
  onStart,
  onFinish,
}: {
  onStart?: (event: Event) => void;
  onFinish?: (event: CloseEvent) => void;
}) => {
  const defaultMessageHistory: MessageEvent[] = [];

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [messageHistory, setMessageHistory] = useState(defaultMessageHistory);
  const { lastMessage } = useWebSocket(socketUrl, {
    onOpen: (event) => {
      setMessageHistory(defaultMessageHistory);
      if (typeof onStart !== "undefined") onStart(event);
    },
    onClose: onFinish,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const assignRun = useCallback((src: string, test: string) => {
    const data = { src: src, test: test };

    fetch("./api/proxy/api/submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(checkFetchError)
      .then((text) => setSocketUrl("ws://tyr.ics.es.osaka-u.ac.jp/" + text.key))
      .catch((err) => console.error(err));
  }, []);

  return [messageHistory, assignRun] as const;
};

export { useKGenProg };

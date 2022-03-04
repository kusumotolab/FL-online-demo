import { useKGenProg } from "../hooks/useKGenProg";
import styles from "../styles/KGenProg.module.css";
import Editor from "./Editor";
import { Ace } from "ace-builds";
import { useEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

function KGenProg({
  src,
  test,
  onSuccess,
  onError,
  ...other
}: { src: string; test: string; onSuccess?: () => void; onError?: () => void } & IAceEditorProps) {
  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();
  const srcRef = useRef(src);
  const testRef = useRef(test);

  const [kgpConsoleHistory, runKgp] = useKGenProg({
    onSuccess: onSuccess,
    onError: onError,
  });

  useEffect(() => {
    if (src === srcRef.current && test === testRef.current) {
      if (typeof onSuccess !== "undefined") onSuccess();
    }
  });

  useEffect(() => {
    runKgp(src, test);
    srcRef.current = src;
    testRef.current = test;
  }, [src, test]);

  return (
    <Editor
      className={styles.editorConsole}
      headerText="Console"
      onLoad={(editor) => setConsoleEditor(editor)}
      name="console"
      readOnly
      value={kgpConsoleHistory
        .filter((message) => message && message.data)
        .map((message) => JSON.parse(message.data))
        .filter((json) => json && json.stdout)
        .map((json) => json.stdout as string)
        .join()}
      onInput={() => {
        if (typeof consoleEditor !== "undefined") {
          const lastLineNumber = consoleEditor.getSession().getLength();
          const lastColumnNumber = consoleEditor.getSession().getLine(lastLineNumber).length;
          consoleEditor.gotoLine(lastLineNumber, lastColumnNumber, false);
        }
      }}
      {...other}
    />
  );
}

export default KGenProg;

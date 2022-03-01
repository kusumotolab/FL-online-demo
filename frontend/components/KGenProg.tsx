import { useKGenProg } from "../hooks/useKGenProg";
import styles from "../styles/KGenProg.module.css";
import Editor from "./Editor";
import { Ace } from "ace-builds";
import { useEffect, useState } from "react";
import { IAceEditorProps } from "react-ace";

function KGenProg({
  src,
  test,
  onSuccess,
  onError,
  ...other
}: { src: string; test: string; onSuccess?: () => void; onError?: () => void } & IAceEditorProps) {
  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();

  const [kgpConsoleHistory, runKgp] = useKGenProg({
    onSuccess: () => {
      if (typeof onSuccess !== "undefined") onSuccess();
    },
    onError: () => {
      if (typeof onError !== "undefined") onError();
    },
  });

  useEffect(() => {
    runKgp(src, test);
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
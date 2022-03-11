import { Ace } from "ace-builds";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

import Editor from "@/components/Editor";
import { useKGenProg } from "@/hooks/useKGenProg";
import styles from "@/styles/KGenProg.module.css";

function KGenProg({
  src,
  test,
  onStart,
  onSuccess,
  onError,
  ...other
}: {
  src: string;
  test: string;
  onStart: () => void;
  onSuccess: (() => void) | undefined;
  onError: (() => void) | undefined;
} & IAceEditorProps) {
  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();

  const { messageHistory: kgpConsoleHistory, runKgp } = useKGenProg({
    onStart,
    onSuccess,
    onError,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef?.current?.scrollIntoView();
  });

  useEffect(() => {
    runKgp(src, test);
  }, [runKgp, src, test]);

  return (
    <div ref={scrollRef}>
      <Editor
        className={styles.editorConsole}
        headerText="Console"
        onLoad={(editor) => {
          setConsoleEditor(editor);
          editor.setShowFoldWidgets(false);
        }}
        name="console"
        readOnly
        value={kgpConsoleHistory
          .filter((message) => message && message.data)
          .map((message) => JSON.parse(message.data))
          .filter((json) => json && json.stdout)
          .map((json) => json.stdout as string)
          .join("")}
        onInput={() => {
          if (typeof consoleEditor !== "undefined") {
            const lastLineNumber = consoleEditor.getSession().getLength();
            const lastColumnNumber = consoleEditor.getSession().getLine(lastLineNumber).length;
            consoleEditor.gotoLine(lastLineNumber, lastColumnNumber, false);
          }
        }}
        {...other}
      />
    </div>
  );
}

export default KGenProg;

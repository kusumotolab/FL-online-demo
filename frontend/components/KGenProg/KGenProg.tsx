import { Ace } from "ace-builds";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

import Editor from "@/components/Editor";
import styles from "@/styles/KGenProg.module.css";
import { Task, failure, ready, running, success } from "@/utils/task";

import { useKGenProg } from "./hooks";

function KGenProg({
  sourceCode,
  testCode,
  setTask,
  abortController,
  ...other
}: {
  sourceCode: string | undefined;
  testCode: string | undefined;
  setTask: Dispatch<SetStateAction<Task>>;
  abortController?: AbortController;
} & IAceEditorProps) {
  const { data, error, isLoading, isAbort } = useKGenProg(sourceCode, testCode, abortController);

  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef?.current?.scrollIntoView();
  });

  useEffect(() => {
    if (isLoading) setTask(running());
    else if (error) setTask(failure());
    else if (isAbort) setTask(ready());
    else if (data) setTask(success());
  }, [data, error, isLoading, isAbort]);

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
        value={data
          ?.filter((message) => message.data)
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

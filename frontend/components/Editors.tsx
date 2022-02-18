import styles from "../styles/Editors.module.css";
import Editor from "./Editor";
import { Ace } from "ace-builds";
import { useCallback } from "react";

function Editors() {
  const loadDefaultSrc = useCallback((uri: RequestInfo): ((editor: Ace.Editor) => void) => {
    return (editor: Ace.Editor) => {
      fetch(uri)
        .then((resp) => resp.text())
        .then((text) => {
          editor.insert(text);
          editor.gotoLine(1, 0, false);
          editor.getSession().getUndoManager().reset();
        });
    };
  }, []);

  return (
    <div className={styles.editors}>
      <Editor headerText="Source" onLoad={loadDefaultSrc("default-src.java")} name="src" />
      <Editor headerText="Test" onLoad={loadDefaultSrc("default-test.java")} name="test" />
      <Editor className={styles.editorConsole} headerText="Console" name="console" readOnly />
    </div>
  );
}

export default Editors;

import styles from "../styles/Editors.module.css";
import { default as AceEditor } from "./AceEditorWrapper";
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
      <div className={styles.editor}>
        <div className={styles.header}>Source</div>
        <AceEditor className={styles.ace} name="src" onLoad={loadDefaultSrc("default-src.java")} />
      </div>
      <div className={`${styles.editor} ${styles.editorRight}`}>
        <div className={styles.header}>Test</div>
        <AceEditor
          className={styles.ace}
          name="test"
          onLoad={loadDefaultSrc("default-test.java")}
        />
      </div>
      <div className={`${styles.editor} ${styles.editorConsole}`}>
        <div className={styles.header}>Console</div>
        <AceEditor className={styles.ace} name="console" readOnly={true} />
      </div>
    </div>
  );
}

export default Editors;

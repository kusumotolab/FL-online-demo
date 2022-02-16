import styles from "../styles/Editors.module.css";
import { default as AceEditor } from "./AceEditorWrapper";

function Editors() {
  return (
    <div className={styles.editors}>
      <div className={styles.editor}>
        <div className={styles.header}>Source</div>
        <AceEditor className={styles.ace} name="src" />
      </div>
      <div className={`${styles.editor} ${styles.editorRight}`}>
        <div className={styles.header}>Test</div>
        <AceEditor className={styles.ace} name="test" />
      </div>
      <div className={`${styles.editor} ${styles.editorConsole}`}>
        <div className={styles.header}>Console</div>
        <AceEditor className={styles.ace} name="console" readOnly={true} />
      </div>
    </div>
  );
}

export default Editors;

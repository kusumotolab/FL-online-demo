import { IAceEditorProps } from "react-ace";

import styles from "../styles/Editor.module.css";
// eslint-disable-next-line import/no-named-default
import { default as AceEditor } from "./AceEditorWrapper";

function Editor({
  headerText,
  className,
  name,
  ...other
}: { headerText: string } & IAceEditorProps) {
  return (
    <div className={`${styles.editor} ${className}`}>
      <div className={styles.header}>{headerText}</div>
      <AceEditor className={styles.ace} name={name} {...other} />
    </div>
  );
}

export default Editor;

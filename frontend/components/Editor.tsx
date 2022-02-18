import styles from "../styles/Editor.module.css";
import { default as AceEditor } from "./AceEditorWrapper";
import { IAceEditorProps } from "react-ace";

function Editor({
  headerText,
  defaultSrcUri,
  className,
  name,
  ...other
}: { headerText: string; defaultSrcUri?: RequestInfo } & IAceEditorProps) {
  return (
    <div className={`${styles.editor} ${className}`}>
      <div className={styles.header}>{headerText}</div>
      <AceEditor className={styles.ace} name={name} {...other} />
    </div>
  );
}

export default Editor;

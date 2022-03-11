import { IAceEditorProps } from "react-ace";

// eslint-disable-next-line import/no-named-default
import { default as AceEditor } from "@/components/AceEditorWrapper";
import styles from "@/styles/Editor.module.css";

function Editor({
  headerText,
  className,
  name,
  onLoad,
  ...other
}: { headerText: string } & IAceEditorProps) {
  return (
    <div className={`${styles.editor} ${className ?? ""}`}>
      <div className={styles.header}>{headerText}</div>
      <AceEditor
        className={styles.ace}
        name={name}
        onLoad={(editor) => {
          document.addEventListener("mouseup", () => editor.resize());
          if (typeof onLoad !== "undefined") onLoad(editor);
        }}
        {...other}
      />
    </div>
  );
}

export default Editor;

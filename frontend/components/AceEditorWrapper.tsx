import { Ace } from "ace-builds";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { IAceEditorProps, IAceOptions } from "react-ace";

const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/mode-java");
    await import("ace-builds/src-noconflict/theme-xcode");
    await import("ace-builds/src-noconflict/snippets/java");
    await import("ace-builds/src-noconflict/ext-language_tools");
    return ace;
  },
  { ssr: false },
);

function AceEditorWrapper({ name, readOnly = false, onLoad, ...other }: IAceEditorProps) {
  const defaultOptions: IAceOptions = {
    showGutter: true,
    minLines: 25,
    maxLines: 25,
    printMargin: false,
    useSoftTabs: true,
    tabSize: 2,
    fontSize: "1rem",
    cursorStyle: undefined,
  };
  const readonlyOptions: IAceOptions = {
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false,
  };

  const [options, setOptions] = useState(defaultOptions);
  useEffect(() => {
    if (readOnly) {
      setOptions({ ...defaultOptions, ...readonlyOptions });
    } else {
      setOptions(defaultOptions);
    }
  }, [readOnly]);

  const switchCursorDisplay = useCallback(
    (editor: Ace.Editor) => {
      if (readOnly) {
        // @ts-ignore
        editor.renderer.$cursorLayer.element.style.display = "none";
      } else {
        // @ts-ignore
        editor.renderer.$cursorLayer.element.style.display = "true";
      }
    },
    [readOnly],
  );

  return (
    <AceEditor
      mode="java"
      theme="xcode"
      width="100%"
      height="100%"
      name={name}
      setOptions={options}
      onLoad={(editor) => {
        switchCursorDisplay(editor);
        if (typeof onLoad !== "undefined") onLoad(editor);
      }}
      {...other}
      enableBasicAutocompletion
      enableLiveAutocompletion
      enableSnippets
    />
  );
}

export default AceEditorWrapper;

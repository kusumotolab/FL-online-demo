import { useFL } from "../hooks/useFL";
import styles from "../styles/FL.module.css";
import Editor from "./Editor";
import { Button } from "@mui/material";
import { Ace } from "ace-builds";
import { useCallback, useEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

function FL({
  src,
  test,
  onSuccess,
  onError,
  ...other
}: { src: string; test: string; onSuccess?: () => void; onError?: () => void } & IAceEditorProps) {
  const { flResult, error, isLoading } = useFL(src, test);

  const [editor, setEditor] = useState<Ace.Editor>();
  const [selectedTechnique, setSelectedTechnique] = useState("Ochiai");

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)!.appendChild(styleElementRef.current);
  }, []);

  useEffect(() => {
    if (!isLoading && flResult && typeof onSuccess !== "undefined") onSuccess();
    if (!isLoading && error && typeof onError !== "undefined") onError();
  });

  useEffect(() => {
    if (isLoading) return;
    if (typeof editor === "undefined") return;

    if (!(selectedTechnique in flResult)) return;

    const markerIds = new Set<number>();

    const maxLength = Math.max(
      ...editor
        .getSession()
        .getValue()
        .split(/\r?\n/)
        .map((s) => s.length),
    );
    for (const [line, _suspiciousness] of Object.entries(
      flResult[selectedTechnique]["suspiciousnesses"],
    )) {
      const lineNumber = Number(line);
      const className = `susp-line-${lineNumber}`;
      const suspiciousness = Number(_suspiciousness);

      // Range を取るためのワークアラウンド（Next.js で new Range() できるように import する方法が分からなかった）
      const range = editor.getSelectionRange();
      range.setStart(lineNumber - 1, 0);
      range.setEnd(lineNumber - 1, 1);

      const lineLength = editor.session.getLine(lineNumber - 1).length + 1;
      editor.session.insert(
        {
          row: lineNumber - 1,
          column: lineLength,
        },
        `${" ".repeat(maxLength - lineLength + 4)}/* suspiciousness: ${Number(
          suspiciousness,
        ).toFixed(3)} */`,
      );

      const markerId = editor.session.addMarker(range, className, "fullLine");
      markerIds.add(markerId);
      styleElementRef.current.textContent =
        styleElementRef.current.textContent +
        `
          .${className} {
            position: absolute;
            background-color: rgba(225, 95, 95, ${Math.tanh(suspiciousness) * 0.9});
            z-index: 20;
          }
        `;
    }

    return () => {
      styleElementRef.current.textContent = "";
      markerIds.forEach((id) => editor.session.removeMarker(id));
    };
  }, [selectedTechnique, editor, flResult]);

  const onClick = useCallback(
    (technique: string) => {
      setSelectedTechnique(technique);
    },
    [setSelectedTechnique],
  );

  if (error) {
    console.error(error);
    return (
      <>
        <h2>Error!</h2>
        <pre>{JSON.stringify(error, null, 4).replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</pre>
      </>
    );
  }
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className={styles.techniques}>
        {Object.keys(flResult).map((technique) => (
          <Button
            key={`${technique}-btn`}
            onClick={() => onClick(technique)}
            variant={selectedTechnique === technique ? "contained" : "outlined"}
          >
            {technique}
          </Button>
        ))}
      </div>
      <Editor
        className={styles.flEditor}
        headerText="FL"
        name="fl"
        readOnly
        value={src}
        onLoad={(editor) => {
          setEditor(editor);
          editor.setShowFoldWidgets(false);
        }}
        {...other}
      />
    </>
  );
}

export default FL;

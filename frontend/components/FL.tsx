import { useFL } from "../hooks/useFL";
import styles from "../styles/FL.module.css";
import Editor from "./Editor";
import { Button, ButtonGroup } from "@mui/material";
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
  const [selectedFormula, setSelectedFormula] = useState("Ochiai");

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)!.appendChild(styleElementRef.current);
  }, []);

  useEffect(() => {
    if (!isLoading && flResult && typeof onSuccess !== "undefined") onSuccess();
    if (!isLoading && error && typeof onError !== "undefined") onError();
  }, [flResult, error, isLoading, onSuccess, onError]);

  useEffect(() => {
    if (isLoading) return;
    if (typeof editor === "undefined") return;

    if (!(selectedFormula in flResult)) return;

    const markerIds = new Set<number>();

    for (const [line, _suspiciousness] of Object.entries(
      flResult[selectedFormula]["suspiciousnesses"],
    )) {
      const lineNumber = Number(line);
      const className = `susp-line-${lineNumber}`;

      // Range を取るためのワークアラウンド（Next.js で new Range() できるように import する方法が分からなかった）
      const range = editor.getSelectionRange();
      range.setStart(lineNumber - 1, 0);
      range.setEnd(lineNumber - 1, 1);

      const markerId = editor.session.addMarker(range, className, "fullLine");
      markerIds.add(markerId);

      const suspiciousness = Number(_suspiciousness);
      styleElementRef.current.textContent =
        styleElementRef.current.textContent +
        `
          .${className} {
            position: absolute;
            background-color: rgba(225, 95, 95, ${Math.tanh(suspiciousness) * 0.9});
            z-index:20;
          }
        `;
    }

    return () => {
      styleElementRef.current.textContent = "";
      markerIds.forEach((id) => editor.session.removeMarker(id));
    };
  }, [selectedFormula, editor, flResult]);

  const onClick = useCallback(
    (formula: string) => {
      setSelectedFormula(formula);
    },
    [setSelectedFormula],
  );

  if (error) return <div>Error!</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className={styles.formulas}>
        {Object.keys(flResult).map((formula) => (
          <Button
            key={`${formula}-btn`}
            onClick={() => onClick(formula)}
            variant={selectedFormula === formula ? "contained" : "outlined"}
          >
            {formula}
          </Button>
        ))}
      </div>
      <div className={styles.container}>
        <Editor
          className={styles.flEditor}
          headerText="FL"
          name="fl"
          readOnly
          value={src}
          onLoad={(editor) => setEditor(editor)}
          {...other}
        />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>line</th>
              <th>suspiciousness</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(flResult[selectedFormula]["suspiciousnesses"]).flatMap(
              ([line, suspiciousness]) => (
                <tr key={line}>
                  <td>{line}</td>
                  <td>{Number(suspiciousness).toFixed(3)}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FL;

import { useFL } from "../hooks/useFL";
import styles from "../styles/FL.module.css";
import Button from "./Button";
import Editor from "./Editor";
import { Ace } from "ace-builds";
import { useCallback, useEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

const clamp = (num: number, low: number, high: number) => Math.min(Math.max(low, num), high);

function FL({ src, test, ...other }: { src: string; test: string } & IAceEditorProps) {
  const { flResult, error, isLoading } = useFL(src, test);

  const [editor, setEditor] = useState<Ace.Editor>();
  const [selectedFormula, setSelectedFormula] = useState("Ochiai");

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)!.appendChild(styleElementRef.current);
  }, []);

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
            background-color: rgba(225, 95, 95, ${clamp(suspiciousness * 0.5, 0, 1)});
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
    <div>
      <div className={styles.formulas}>
        {Object.keys(flResult).map((formula) => (
          <Button className={styles.btn} key={`${formula}-btn`} onClick={() => onClick(formula)}>
            {formula}
          </Button>
        ))}
      </div>
      <Editor
        className={styles.flEditor}
        headerText="FL"
        name="fl"
        readOnly
        value={src}
        onLoad={(editor) => setEditor(editor)}
        {...other}
      />
    </div>
  );
}

export default FL;

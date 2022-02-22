import styles from "../styles/FL.module.css";
import checkFetchError from "../util/checkFetchError";
import Button from "./Button";
import Editor from "./Editor";
import { Ace } from "ace-builds";
import { useCallback, useEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";
import useSWRImmutable from "swr/immutable";

const clamp = (num: number, low: number, high: number) => Math.min(Math.max(low, num), high);

const fetcher = (url: RequestInfo, src: string, test: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ src: src, test: test }),
  })
    .then(checkFetchError)
    .then((res) => res)
    .catch((err) => console.error(err));

function FL({ src, test, ...other }: { src: string; test: string } & IAceEditorProps) {
  // const { data, error } = useSWRImmutable(["/api/fl/all", src, test], fetcher);
  const data: any = {
    DStar: {
      suspiciousnesses: { "1": 0.33333333333333331, "2": "Infinity", "3": 0.33333333333333331 },
    },
    Jaccard: { suspiciousnesses: { "1": 0.25, "2": 1.0, "3": 0.25 } },
    Zolter: { suspiciousnesses: { "1": 0.25, "2": 1.0, "3": 0.25 } },
    Ample: {
      suspiciousnesses: {
        "1": 1.0,
        "2": 1.0,
        "3": 0.66666666666666663,
        "4": 0.33333333333333331,
      },
    },
    Ochiai: { suspiciousnesses: { "1": 0.5, "2": 1.0, "3": 0.5 } },
    Tarantula: { suspiciousnesses: { "1": 0.5, "2": 1.0, "3": 0.5 } },
  };
  let error = undefined;

  const [editor, setEditor] = useState<Ace.Editor>();
  const [selectedFormula, setSelectedFormula] = useState("Ochiai");

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)!.appendChild(styleElementRef.current);
  }, []);

  useEffect(() => {
    if (!data) return;
    if (typeof editor === "undefined") return;

    if (!(selectedFormula in data)) return;

    const markerIds = new Set<number>();

    for (const [line, _suspiciousness] of Object.entries(
      data[selectedFormula]["suspiciousnesses"],
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
  }, [selectedFormula, editor, data]);

  const onClick = useCallback(
    (formula: string) => {
      setSelectedFormula(formula);
    },
    [setSelectedFormula],
  );

  if (error) return <div>Error!</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.formulas}>
        {Object.keys(data).map((formula) => (
          <Button key={`${formula}-btn`} onClick={() => onClick(formula)}>
            {formula}
          </Button>
        ))}
      </div>
      <Editor
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

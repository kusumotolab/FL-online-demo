import { Button } from "@mui/material";
import { Ace } from "ace-builds";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

import Editor from "@/components/Editor";
import { useFL } from "@/hooks/useFL";
import { components } from "@/schemas/backend";
import styles from "@/styles/FL.module.css";

function FL({
  src,
  test,
  onSuccess,
  onError,
  ...other
}: { src: string; test: string; onSuccess?: () => void; onError?: () => void } & IAceEditorProps) {
  const { flResults, error, isLoading } = useFL(src, test);

  const [editor, setEditor] = useState<Ace.Editor>();
  const [selectedTechnique, setSelectedTechnique] = useState("Ochiai");

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef?.current?.scrollIntoView();
  });

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)?.appendChild(styleElementRef.current);
  }, []);

  useEffect(() => {
    if (!isLoading && flResults && typeof onSuccess !== "undefined") onSuccess();
    if (!isLoading && error && typeof onError !== "undefined") onError();
  });

  useEffect(() => {
    if (isLoading) return undefined;
    if (typeof editor === "undefined") return undefined;

    const markerIds = new Set<number>();

    const maxLength = Math.max(
      ...editor
        .getSession()
        .getValue()
        .split(/\r?\n/)
        .map((s) => s.length),
    );

    flResults
      ?.filter((flResult) => flResult.technique === selectedTechnique)
      .forEach((flResult) => {
        // flResult を lineNumber をキーとして groupBy して
        // lineNumber ごとに suspiciousness の値が最大のものを抽出
        type Suspiciousness = components["schemas"]["Suspiciousness"];
        const suspiciousnesses = Object.entries(
          flResult?.suspiciousnesses!.reduce<{
            [key: Exclude<Suspiciousness["lineNumber"], undefined>]: Suspiciousness[];
          }>((obj, result) => {
            if (typeof result.lineNumber === "undefined") return obj;
            obj[result.lineNumber] ??= [];
            obj[result.lineNumber].push(result);
            return obj;
          }, {}),
        )
          .map(([key, value]) => ({ key, value }))
          .map((o) =>
            o.value.reduce((a, b) =>
              Number(a.rawSuspiciousness) > Number(b.rawSuspiciousness) ? a : b,
            ),
          );

        suspiciousnesses.forEach(
          ({
            lineNumber: _lineNumber,
            rawSuspiciousness: _suspiciousness,
            normalizedSuspiciousness: _normalizedSuspiciousness,
          }) => {
            const lineNumber = Number(_lineNumber);
            const className = `susp-line-${lineNumber}`;
            const suspiciousness = Number(_suspiciousness);
            const normalizedSuspiciousness = Number(_normalizedSuspiciousness);

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
            // 範囲選択時の選択範囲が視認できるように alpha の最大値を 0.9 にしている
            styleElementRef.current.textContent += `
            .${className} {
              position: absolute;
              background-color: rgba(225, 95, 95, ${normalizedSuspiciousness * 0.9});
              z-index: 20;
            }
          `;
          },
        );
      });

    const styleElement = styleElementRef.current;

    return () => {
      styleElement.textContent = "";
      markerIds.forEach((id) => editor.session.removeMarker(id));
    };
  }, [selectedTechnique, editor, flResults, isLoading]);

  const onClick = useCallback(
    (technique: string) => {
      setSelectedTechnique(technique);
    },
    [setSelectedTechnique],
  );

  if (error) {
    // eslint-disable-next-line no-console
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
    <div ref={scrollRef}>
      <div className={styles.techniques}>
        {flResults?.map((flResult) => {
          const { technique } = flResult;
          if (typeof technique === "undefined") return "";
          return (
            <Button
              key={`${technique}-btn`}
              onClick={() => {
                if (typeof technique !== "undefined") onClick(technique);
              }}
              variant={selectedTechnique === technique ? "contained" : "outlined"}
            >
              {technique}
            </Button>
          );
        })}
      </div>
      <Editor
        className={styles.flEditor}
        headerText="FL"
        name="fl"
        readOnly
        value={src}
        onLoad={(flEditor) => {
          setEditor(flEditor);
          flEditor.setShowFoldWidgets(false);
        }}
        {...other}
      />
    </div>
  );
}

export default FL;

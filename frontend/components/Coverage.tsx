import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Ace } from "ace-builds";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IAceEditorProps } from "react-ace";

import Editor from "@/components/Editor";
import { useTests } from "@/hooks/useTests";
import styles from "@/styles/Coverage.module.css";

function Coverage({
  src,
  test,
  onSuccess,
  onError,
  ...other
}: { src: string; test: string; onSuccess?: () => void; onError?: () => void } & IAceEditorProps) {
  const { testResults, error, isLoading } = useTests(src, test);

  const [checked, setChecked] = useState(new Map<string, boolean>());

  const [editor, setEditor] = useState<Ace.Editor>();

  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef?.current?.scrollIntoView();
  });

  const styleElementRef = useRef(document.createElement("style"));
  useEffect(() => {
    document.getElementsByTagName("head").item(0)?.appendChild(styleElementRef.current);
  }, []);

  const red = "rgba(225, 95, 95, 0.5)";
  const green = "rgba(95, 225, 95, 0.5)";
  const yellow = "rgba(225, 225, 95, 0.5)";

  useEffect(() => {
    if (!isLoading && testResults && typeof onSuccess !== "undefined") onSuccess();
    if (!isLoading && error && typeof onError !== "undefined") onError();
  });

  useEffect(() => {
    if (typeof testResults === "undefined") return;
    setChecked(
      new Map(
        testResults
          .map(({ testMethod }) => testMethod)
          .filter((testMethod) => typeof testMethod !== "undefined")
          .map((testMethod) => [testMethod!, true]),
      ),
    );
  }, [testResults]);

  useEffect(() => {
    if (isLoading) return undefined;
    if (typeof editor === "undefined") return undefined;

    const coverages = new Map<number, { status: string; failed: boolean }>();
    testResults?.forEach((testResult) => {
      const { testMethod } = testResult;

      if (typeof testMethod === "undefined") return;
      if (!checked.get(testMethod)) return;

      testResult.coverages?.forEach((coverage) => {
        const { lineNumber } = coverage;
        const { status } = coverage;

        if (status === "EMPTY") return;

        if (status === "COVERED" || coverages.get(lineNumber)?.status !== "COVERED") {
          coverages.set(lineNumber, { status, failed: testResult.failed || false });
        }
      });
    });

    const markerIds = new Set<number>();
    coverages.forEach(({ status, failed }, lineNumber) => {
      if (status === "EMPTY") return;

      // Range を取るためのワークアラウンド（Next.js で new Range() できるように import する方法が分からなかった）
      const range = editor.getSelectionRange();
      range.setStart(lineNumber, 0);
      range.setEnd(lineNumber, 1);

      const className = `coverage-line-${lineNumber}`;

      const markerId = editor.session.addMarker(range, className, "fullLine");
      markerIds.add(markerId);
      styleElementRef.current.textContent += `
          .${className} {
            position: absolute;
            background-color: ${status !== "COVERED" ? yellow : failed ? red : green};
            z-index: 20;
          }
        `;
    });

    const styleElement = styleElementRef.current;

    return () => {
      styleElement.textContent = "";
      markerIds.forEach((id) => editor.session.removeMarker(id));
    };
  }, [editor, testResults, checked, isLoading]);

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
    <div className={styles.container} ref={scrollRef}>
      <div className={styles.coverage}>
        <Editor
          className={styles.editor}
          headerText="Coverage"
          name="coverage"
          readOnly
          value={src}
          onLoad={(coverageEditor) => {
            setEditor(coverageEditor);
            coverageEditor.setShowFoldWidgets(false);
          }}
          {...other}
        />
        <div className={styles.colorExamples}>
          <div className={styles.colorExample}>
            <div
              className={styles.colorBox}
              style={{ width: "2em", height: "1em", backgroundColor: red }}
            />
            <span className={styles.colorDescription}>covered & test failed</span>
          </div>
          <div className={styles.colorExample}>
            <div
              className={styles.colorBox}
              style={{ width: "2em", height: "1em", backgroundColor: green }}
            />
            <span className={styles.colorDescription}>covered & test pass</span>
          </div>
          <div className={styles.colorExample}>
            <div
              className={styles.colorBox}
              style={{ width: "2em", height: "1em", backgroundColor: yellow }}
            />
            <span className={styles.colorDescription}>not covered</span>
          </div>
        </div>
      </div>
      <div className={styles.checkboxes}>
        <FormControlLabel
          label="すべてのテスト"
          control={
            <Checkbox
              checked={Array.from(checked.values()).every((x) => x)}
              indeterminate={
                Array.from(checked.values()).some((x) => x) &&
                !Array.from(checked.values()).every((x) => x)
              }
              onChange={(event) => {
                setChecked(
                  (prev) =>
                    new Map(
                      Array.from(prev.keys()).map((testMethod) => {
                        return [testMethod, event.target.checked];
                      }),
                    ),
                );
              }}
            />
          }
        />
        <div className={styles.testMethods}>
          {testResults?.map((testResult) => {
            const { testMethod } = testResult;
            if (typeof testMethod === "undefined") return "";

            const { failed } = testResult;
            return (
              <FormControlLabel
                className={styles.label}
                key={`${testMethod}-label`}
                label={
                  <span className={styles.test}>
                    {testMethod}
                    {failed ? (
                      <CancelIcon className={styles.icon} color="error" />
                    ) : (
                      <CheckCircleIcon className={styles.icon} color="success" />
                    )}
                  </span>
                }
                control={
                  <Checkbox
                    checked={!!checked.get(testMethod)}
                    onChange={(event) =>
                      setChecked((prev) => {
                        return new Map(prev).set(event.target.name, event.target.checked);
                      })
                    }
                    name={testMethod}
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Coverage;

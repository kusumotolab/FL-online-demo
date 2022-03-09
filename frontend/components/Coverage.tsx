import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Ace } from "ace-builds";
import { useEffect, useRef, useState } from "react";
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

  const [checked, setChecked] = useState({});

  const [editor, setEditor] = useState<Ace.Editor>();

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
      Object.fromEntries(
        testResults.map((testResult) => {
          const { testMethod } = testResult;
          return [testMethod, true];
        }),
      ),
    );
  }, [testResults]);

  useEffect(() => {
    if (isLoading) return;
    if (typeof editor === "undefined") return;

    const coverages = new Map<number, { status: string; failed: boolean }>();
    testResults?.forEach((testResult) => {
      const { testMethod } = testResult;

      if (!checked[testMethod]) return;

      testResult.coverages.forEach((coverage) => {
        const { lineNumber } = coverage;
        const { status } = coverage;

        if (status === "EMPTY") return;

        if (status === "COVERED" || coverages.get(lineNumber)?.status !== "COVERED") {
          coverages.set(lineNumber, { status, failed: testResult.failed });
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

    return () => {
      styleElementRef.current.textContent = "";
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
    <div className={styles.container}>
      <div className={styles.coverage}>
        <Editor
          className={styles.editor}
          headerText="Coverage"
          name="coverage"
          readOnly
          value={src}
          onLoad={(editor) => {
            setEditor(editor);
            editor.setShowFoldWidgets(false);
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
              checked={Array.from(Object.entries(checked)).every(([_, x]) => x)}
              indeterminate={
                Array.from(Object.entries(checked)).some(([_, x]) => x) &&
                !Array.from(Object.entries(checked)).every(([_, x]) => x)
              }
              onChange={(event) => {
                setChecked((prev) =>
                  Object.fromEntries(
                    Object.entries(prev).map(([testMethod, _]) => {
                      return [testMethod, event.target.checked];
                    }),
                  ),
                );
              }}
            />
          }
        />
        <div className={styles.testMethods}>
          {testResults.map((testResult) => {
            const { testMethod } = testResult;
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
                    checked={checked[testMethod] || false}
                    onChange={(event) =>
                      setChecked((prev) => {
                        return { ...prev, [event.target.name]: event.target.checked };
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

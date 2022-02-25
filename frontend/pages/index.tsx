import Button from "../components/Button";
import Editor from "../components/Editor";
import FL from "../components/FL";
import { useKGenProg } from "../hooks/useKGenProg";
import styles from "../styles/Home.module.css";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";

const Home: NextPage = () => {
  const [srcEditor, setSrcEditor] = useState<Ace.Editor>();
  const [testEditor, setTestEditor] = useState<Ace.Editor>();
  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();

  const [isRunning, setIsRunning] = useState(false);
  const [ctrl, setCtrl] = useState<"repair" | "fl" | null>(null);

  const [kgpConsoleHistory, runKgp] = useKGenProg({
    onFinish: () => setIsRunning(false),
  });

  const loadDefaultSrc = useCallback((uri: RequestInfo): ((editor: Ace.Editor) => void) => {
    return (editor: Ace.Editor) => {
      fetch(uri)
        .then((resp) => resp.text())
        .then((text) => {
          editor.insert(text);
          editor.gotoLine(1, 0, false);
          editor.getSession().getUndoManager().reset();
        });
    };
  }, []);

  const resultElement = useCallback(() => {
    switch (ctrl) {
      case "repair":
        return (
          <Editor
            className={styles.editorConsole}
            headerText="Console"
            onLoad={(editor) => setConsoleEditor(editor)}
            name="console"
            readOnly
            value={kgpConsoleHistory
              .filter((message) => message && message.data)
              .map((message) => JSON.parse(message.data))
              .filter((json) => json && json.stdout)
              .map((json) => json.stdout as string)
              .join()}
            onInput={() => {
              if (typeof consoleEditor !== "undefined") {
                const lastLineNumber = consoleEditor.getSession().getLength();
                const lastColumnNumber = consoleEditor.getSession().getLine(lastLineNumber).length;
                consoleEditor.gotoLine(lastLineNumber, lastColumnNumber, false);
              }
            }}
          />
        );
      case "fl":
        if (typeof srcEditor === "undefined") return <></>;
        if (typeof testEditor === "undefined") return <></>;
        return (
          <FL
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onFinish={() => setIsRunning(false)}
          />
        );
      default:
        return <></>;
    }
  }, [ctrl, kgpConsoleHistory]);

  const onClickRepair = useCallback(() => {
    runKgp(srcEditor!.getValue(), testEditor!.getValue());
    setCtrl("repair");
    setIsRunning(true);
  }, [srcEditor, testEditor]);

  const onClickFL = useCallback(() => {
    setCtrl("fl");
    setIsRunning(true);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>FL online demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header id={styles.logo}>
        <a href="./">
          {/* <img className={styles.logoImg} src="/logo.png" /> */}
          <h1>FL online demo</h1>
        </a>
      </header>
      <span id={styles.forkongithub}>
        <a href="https://github.com/kusumotolab/FL-online-demo/">Fork me on GitHub</a>
      </span>

      <main className={styles.main}>
        <div id={styles.ctrl}>
          <Button
            className={styles.btn}
            onClick={onClickRepair}
            disabled={isRunning}
            on={ctrl === "repair"}
          >
            Repair
          </Button>
          <Button
            className={styles.btn}
            onClick={onClickFL}
            disabled={isRunning}
            on={ctrl === "fl"}
          >
            FL
          </Button>
          <Button className={styles.btn} disabled={true}>
            # dummy
          </Button>
        </div>

        <div className={styles.editors}>
          <Editor
            headerText="Source"
            onLoad={(editor) => {
              setSrcEditor(editor);
              loadDefaultSrc("default-src.java")(editor);
            }}
            name="src"
          />
          <Editor
            headerText="Test"
            onLoad={(editor) => {
              setTestEditor(editor);
              loadDefaultSrc("default-test.java")(editor);
            }}
            name="test"
          />
        </div>

        {resultElement()}
      </main>
    </div>
  );
};

export default Home;

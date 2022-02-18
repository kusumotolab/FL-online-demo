import Button from "../components/Button";
import Editor from "../components/Editor";
import styles from "../styles/Home.module.css";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";

const Home: NextPage = () => {
  const [srcEditor, setSrcEditor] = useState<Ace.Editor>();
  const [testEditor, setTestEditor] = useState<Ace.Editor>();
  const [consoleEditor, setConsoleEditor] = useState<Ace.Editor>();

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

  const onClickFL = useCallback(() => {
    console.log("clicked FL");
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
        <a href="https://github.com/kusumotolab/kGenProg/">Fork me on GitHub</a>
      </span>

      <main className={styles.main}>
        <div id={styles.ctrl}>
          <Button className={styles.btn} disabled={true}>
            Repair
          </Button>
          <Button className={styles.btn} onClick={onClickFL}>
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
              console.log("loaded ");
              console.log(editor);
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
        <Editor
          className={styles.editorConsole}
          headerText="Console"
          onLoad={(editor) => setConsoleEditor(editor)}
          name="console"
          readOnly
        />
      </main>
    </div>
  );
};

export default Home;

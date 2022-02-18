import Button from "../components/Button";
import Editor from "../components/Editor";
import styles from "../styles/Home.module.css";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";

const Home: NextPage = () => {
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
          <Button className={styles.btn}>Repair</Button>
          <Button className={styles.btn} disabled={true}>
            # dummy
          </Button>
          <Button className={styles.btn} disabled={true}>
            # dummy
          </Button>
        </div>

        <div className={styles.editors}>
          <Editor headerText="Source" onLoad={loadDefaultSrc("default-src.java")} name="src" />
          <Editor headerText="Test" onLoad={loadDefaultSrc("default-test.java")} name="test" />
        </div>
        <Editor className={styles.editorConsole} headerText="Console" name="console" readOnly />
      </main>
    </div>
  );
};

export default Home;

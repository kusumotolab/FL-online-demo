import Editor from "../components/Editor";
import FL from "../components/FL";
import KGenProg from "../components/KGenProg";
import styles from "../styles/Home.module.css";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BugReportIcon from "@mui/icons-material/BugReport";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";

const Home: NextPage = () => {
  const [srcEditor, setSrcEditor] = useState<Ace.Editor>();
  const [testEditor, setTestEditor] = useState<Ace.Editor>();

  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ctrl, setCtrl] = useState<"repair" | "fl" | null>(null);

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

  const onSuccess = useCallback(() => {
    setIsRunning(false);
    setIsSuccess(true);
    setIsError(false);
  }, []);
  const onError = useCallback(() => {
    setIsRunning(false);
    setIsSuccess(false);
    setIsError(true);
  }, []);

  const resultElement = useCallback(() => {
    if (typeof srcEditor === "undefined") return <></>;
    if (typeof testEditor === "undefined") return <></>;
    switch (ctrl) {
      case "repair":
        return (
          <KGenProg
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onSuccess={onSuccess}
            onError={onError}
          />
        );
      case "fl":
        return (
          <FL
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onSuccess={onSuccess}
            onError={onError}
          />
        );
      default:
        return <></>;
    }
  }, [ctrl]);

  const onClickRepair = useCallback(() => {
    setCtrl("repair");
    setIsRunning(true);
  }, []);

  const onClickFL = useCallback(() => {
    setCtrl("fl");
    setIsRunning(true);
  }, []);

  const isRepairLoading = ctrl === "repair" && isRunning;
  const isFLLoading = ctrl === "fl" && isRunning;

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
            onClick={onClickRepair}
            startIcon={isRepairLoading ? <CircularProgress color="inherit" /> : <AutoFixHighIcon />}
            color={
              ctrl !== "repair" ? "primary" : isSuccess ? "success" : isError ? "error" : "primary"
            }
            variant={ctrl === "repair" ? "contained" : "outlined"}
            disabled={isRunning}
          >
            Repair
          </Button>
          <Button
            onClick={onClickFL}
            startIcon={isFLLoading ? <CircularProgress color="inherit" /> : <BugReportIcon />}
            color={
              ctrl !== "fl" ? "primary" : isSuccess ? "success" : isError ? "error" : "primary"
            }
            variant={ctrl === "fl" ? "contained" : "outlined"}
            disabled={isRunning}
          >
            FL
          </Button>
          <Button startIcon={<PlayArrowIcon />} disabled={true}>
            Test
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

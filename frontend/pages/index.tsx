import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BugReportIcon from "@mui/icons-material/BugReport";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";

import Coverage from "@/components/Coverage";
import Editor from "@/components/Editor";
import FL from "@/components/FL";
import Image from "@/components/Image";
import KGenProg from "@/components/KGenProg";
import useForceUpdate from "@/hooks/useForceUpdate";
import styles from "@/styles/Home.module.css";
import * as LocalStorage from "@/utils/LocalStorage";

const HoverableGitHubIcon = styled(GitHubIcon)({
  "&:hover": {
    color: "var(--header-contents-color-hovered)",
  },
});

const Home: NextPage = () => {
  const [srcEditor, setSrcEditor] = useState<Ace.Editor>();
  const [testEditor, setTestEditor] = useState<Ace.Editor>();

  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ctrl, setCtrl] = useState<"repair" | "fl" | "test" | null>(null);
  const forceUpdate = useForceUpdate();

  const setText = useCallback((text: string, editor: Ace.Editor) => {
    editor.insert(text);
    editor.gotoLine(1, 0, false);
    editor.getSession().getUndoManager().reset();
  }, []);

  const loadDefaultSrc = useCallback(
    (uri: RequestInfo, editor: Ace.Editor) => {
      void fetch(uri)
        .then((resp) => resp.text())
        .then((text) => setText(text, editor));
    },
    [setText],
  );

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

  const onClickRepair = useCallback(() => {
    setCtrl("repair");
    forceUpdate();
  }, [forceUpdate]);

  const onClickFL = useCallback(() => {
    setCtrl("fl");
    setIsRunning(true);
    forceUpdate();
  }, [forceUpdate]);

  const onClickTest = useCallback(() => {
    setCtrl("test");
    setIsRunning(true);
    forceUpdate();
  }, [forceUpdate]);

  const onStartRepair = useCallback(() => {
    setIsRunning(true);
  }, []);

  const isRepairLoading = ctrl === "repair" && isRunning;
  const isFLLoading = ctrl === "fl" && isRunning;
  const isTestLoading = ctrl === "test" && isRunning;

  return (
    <div className={styles.container}>
      <Head>
        <title>FL online demo</title>
        <link rel="icon" href="data:image/x-icon;," />
      </Head>

      <header id={styles.logo}>
        <div style={{ position: "relative", width: "4rem", height: "90%" }}>
          <Image src="./logo.png" layout="fill" objectFit="contain" alt="logo" />
        </div>
        <a
          className={styles.title}
          href="./"
          onClick={() => {
            LocalStorage.removeItem(LocalStorage.KEY.SRC);
            LocalStorage.removeItem(LocalStorage.KEY.TEST);
          }}
        >
          <h1>FL online demo</h1>
        </a>
        <span className={styles.icons}>
          <a href="https://github.com/kusumotolab/FL-online-demo/">
            <HoverableGitHubIcon htmlColor="var(--header-contents-color)" fontSize="large" />
          </a>
        </span>
      </header>

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
          <Button
            onClick={onClickTest}
            startIcon={isTestLoading ? <CircularProgress color="inherit" /> : <PlayArrowIcon />}
            color={
              ctrl !== "test" ? "primary" : isSuccess ? "success" : isError ? "error" : "primary"
            }
            variant={ctrl === "test" ? "contained" : "outlined"}
            disabled={isRunning}
          >
            Test
          </Button>
        </div>

        <div className={styles.editors}>
          <Editor
            headerText="Source"
            onLoad={(editor) => {
              setSrcEditor(editor);

              const cache = LocalStorage.getItem(LocalStorage.KEY.SRC);
              if (cache === null) {
                loadDefaultSrc("default-src.java", editor);
              } else {
                setText(cache, editor);
              }
            }}
            onChange={(value) => {
              LocalStorage.setItem(LocalStorage.KEY.SRC, value);
            }}
            name="src"
          />
          <Editor
            headerText="Test"
            onLoad={(editor) => {
              setTestEditor(editor);

              const cache = LocalStorage.getItem(LocalStorage.KEY.TEST);
              if (cache === null) {
                loadDefaultSrc("default-test.java", editor);
              } else {
                setText(cache, editor);
              }
            }}
            onChange={(value) => {
              LocalStorage.setItem(LocalStorage.KEY.TEST, value);
            }}
            name="test"
          />
        </div>

        {typeof srcEditor === "undefined" || typeof testEditor === "undefined" ? (
          ""
        ) : ctrl === "repair" ? (
          <KGenProg
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onStart={onStartRepair}
            onSuccess={onSuccess}
            onError={onError}
          />
        ) : ctrl === "fl" ? (
          <FL
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onSuccess={onSuccess}
            onError={onError}
          />
        ) : ctrl === "test" ? (
          <Coverage
            src={srcEditor.getValue()}
            test={testEditor.getValue()}
            onSuccess={onSuccess}
            onError={onError}
          />
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default Home;

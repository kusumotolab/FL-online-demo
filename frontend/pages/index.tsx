import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BugReportIcon from "@mui/icons-material/BugReport";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { styled } from "@mui/material/styles";
import { Ace } from "ace-builds";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";

import { Button } from "@/components/Button";
import { Coverage } from "@/components/Coverage";
import Editor from "@/components/Editor";
import { FaultLocalization } from "@/components/FaultLocalization";
import Image from "@/components/Image";
import { KGenProg } from "@/components/KGenProg";
import styles from "@/styles/Home.module.css";
import * as LocalStorage from "@/utils/LocalStorage";
import { Task, isReady, ready, start } from "@/utils/task";

const HoverableGitHubIcon = styled(GitHubIcon)({
  "&:hover": {
    color: "var(--header-contents-color-hovered)",
  },
});

let sourceCode: string | undefined;
let testCode: string | undefined;

const Home: NextPage = () => {
  const [repair, setRepair] = useState<Task>(ready());
  const [fl, setFl] = useState<Task>(ready());
  const [test, setTest] = useState<Task>(ready());

  const [abortController, setAbortController] = useState(new AbortController());
  const abort = useCallback(() => {
    abortController.abort();
    setAbortController(new AbortController());
  }, [abortController]);

  const insertText = useCallback((text: string, editor: Ace.Editor) => {
    editor.insert(text);
    editor.gotoLine(1, 0, false);
    editor.getSession().getUndoManager().reset();
  }, []);

  const loadDefaultSrc = useCallback(
    (uri: RequestInfo, editor: Ace.Editor) => {
      void fetch(uri)
        .then((resp) => resp.text())
        .then((text) => insertText(text, editor));
    },
    [insertText],
  );

  const onClickRepair = useCallback(() => {
    abort();

    setRepair(start());
    setFl(ready());
    setTest(ready());
  }, [abort]);

  const onClickFL = useCallback(() => {
    abort();

    setRepair(ready());
    setFl(start());
    setTest(ready());
  }, [abort]);

  const onClickTest = useCallback(() => {
    abort();

    setRepair(ready());
    setFl(ready());
    setTest(start());
  }, [abort]);

  return (
    <div className={styles.container}>
      <Head>
        <title>FL online demo</title>
        <link rel="icon" href="data:image/x-icon;," />
      </Head>

      <header id={styles.logo}>
        <div style={{ position: "relative", width: "4rem", height: "90%" }}>
          <Image src="./logo.png" layout="fill" objectFit="contain" alt="logo" unoptimized />
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
          <Button task={repair} icon={<AutoFixHighIcon />} onClick={onClickRepair}>
            Repair
          </Button>
          <Button task={fl} icon={<BugReportIcon />} onClick={onClickFL}>
            FL
          </Button>
          <Button task={test} icon={<PlayArrowIcon />} onClick={onClickTest}>
            Test
          </Button>
        </div>

        <div className={styles.editors}>
          <Editor
            headerText="Source"
            onLoad={(editor) => {
              const cache = LocalStorage.getItem(LocalStorage.KEY.SRC);
              if (cache === null) {
                loadDefaultSrc("default-src.java", editor);
              } else {
                insertText(cache, editor);
              }
            }}
            onChange={(value) => {
              LocalStorage.setItem(LocalStorage.KEY.SRC, value);
              sourceCode = value;
            }}
            name="src"
            value={sourceCode}
          />
          <Editor
            headerText="Test"
            onLoad={(editor) => {
              const cache = LocalStorage.getItem(LocalStorage.KEY.TEST);
              if (cache === null) {
                loadDefaultSrc("default-test.java", editor);
              } else {
                insertText(cache, editor);
              }
            }}
            onChange={(value) => {
              LocalStorage.setItem(LocalStorage.KEY.TEST, value);
              testCode = value;
            }}
            name="test"
            value={testCode}
          />
        </div>

        {!isReady(repair) ? (
          <KGenProg
            sourceCode={sourceCode}
            testCode={testCode}
            setTask={setRepair}
            abortController={abortController}
          />
        ) : !isReady(fl) ? (
          <FaultLocalization
            sourceCode={sourceCode}
            testCode={testCode}
            setTask={setFl}
            abortController={abortController}
          />
        ) : !isReady(test) ? (
          <Coverage
            sourceCode={sourceCode}
            testCode={testCode}
            setTask={setTest}
            abortController={abortController}
          />
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default Home;

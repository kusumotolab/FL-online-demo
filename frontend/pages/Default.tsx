import GitHubIcon from "@mui/icons-material/GitHub";
import { styled } from "@mui/material/styles";
import type { NextPage } from "next";
import Head from "next/head";

import Image from "@/components/Image";
import styles from "@/styles/Home.module.css";

const HoverableGitHubIcon = styled(GitHubIcon)({
  "&:hover": {
    color: "var(--header-contents-color-hovered)",
  },
});

const Home: NextPage = () => {
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
        <a className={styles.title} href="./">
          <h1>FL online demo</h1>
        </a>
        <span className={styles.icons}>
          <a href="https://github.com/kusumotolab/FL-online-demo/">
            <HoverableGitHubIcon htmlColor="var(--header-contents-color)" fontSize="large" />
          </a>
        </span>
      </header>

      <main className={styles.main} />
    </div>
  );
};

export default Home;

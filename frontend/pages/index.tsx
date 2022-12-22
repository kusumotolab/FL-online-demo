import type { NextPage } from "next";
import Head from "next/head";

import styles from "@/styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>FL online demo</title>
        <link rel="icon" href="data:image/x-icon;," />
      </Head>

      <main className={styles.main} />
    </div>
  );
};

export default Home;

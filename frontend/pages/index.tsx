import type { NextPage } from "next";

import { Head } from "@/components/Head";
import styles from "@/styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head />

      <main className={styles.main} />
    </div>
  );
};

export default Home;

import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
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
      <span id={styles.forkongithub}><a href="https://github.com/kusumotolab/kGenProg/">Fork me on GitHub</a></span>

      <main className={styles.main}>
        <div id={styles.ctrl}>
          <button id={styles.run} className={`${styles.btn} ${styles.btnRun}`}>Repair</button>
          <button className={`${styles.btn} ${styles.btnOther}`} disabled={true}># dummy</button>
          <button id={styles.refresh} className={`${styles.btn} ${styles.btnOther}`} disabled={true}># dummy</button>
        </div>
        <div className={styles.editors}>
            <div className={styles.editor}>
                <div className={styles.header}>Source</div>
                <div id={styles.src} className={styles.ace}></div>
            </div>
            <div className={`${styles.editor} ${styles.editorRight}`}>
                <div className={styles.header}>Test</div>
                <div id={styles.test} className={styles.ace}></div>
            </div>
        </div>
        <div className={styles.editors}>
            <div className={`${styles.editor} ${styles.editorConsole}`}>
                <div className={styles.header}>Console</div>
                <div id={styles.console} className={styles.ace}></div>
            </div>
        </div>
      </main>
    </div>
  )
}

export default Home

import GitHubIcon from "@mui/icons-material/GitHub";
import { styled } from "@mui/material/styles";

import Image from "@/components/Image";
import styles from "@/styles/Header.module.css";

const HoverableGitHubIcon = styled(GitHubIcon)({
  "&:hover": {
    color: "var(--header-contents-color-hovered)",
  },
});

function Header() {
  return (
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
  );
}

export default Header;

import NextHead from "next/head";
import { ReactNode } from "react";

function Head({ children }: { children?: ReactNode }) {
  return (
    <NextHead>
      <title>FL online demo</title>
      <link rel="icon" href="data:image/x-icon;," />
      {children}
    </NextHead>
  );
}

export default Head;

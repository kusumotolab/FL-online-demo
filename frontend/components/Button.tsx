import styles from "../styles/Button.module.css";
import { ComponentPropsWithoutRef } from "react";

function Button({ className, children, ...other }: ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`${styles.btn} ${className}`} {...other}>
      {children}
    </button>
  );
}

export default Button;

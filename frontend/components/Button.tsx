import styles from "../styles/Button.module.css";
import { ComponentPropsWithoutRef } from "react";

function Button({
  className,
  children,
  on = false,
  ...other
}: { on?: boolean } & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`${styles.btn} ${on && styles.on} ${className}`} {...other}>
      {children}
    </button>
  );
}

export default Button;

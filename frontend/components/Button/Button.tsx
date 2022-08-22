import { CircularProgress, Button as MuiButton } from "@mui/material";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Task, isRunning } from "@/utils/task";

import { color, variant } from "./utils";

function Button({
  task,
  icon,
  children,
  ...other
}: { task: Task; icon: ReactNode } & ComponentPropsWithoutRef<typeof MuiButton>) {
  return (
    <MuiButton
      startIcon={isRunning(task) ? <CircularProgress color="inherit" /> : icon}
      color={color(task)}
      variant={variant(task)}
      disabled={isRunning(task)}
      {...other}
    >
      {children}
    </MuiButton>
  );
}

export default Button;

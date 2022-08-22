import { Button } from "@mui/material";
import { ComponentProps } from "react";

import { Task, isFailure, isReady, isStart, isSuccess } from "@/utils/task";

type muiButtonPropsType = ComponentProps<typeof Button>;

type colorType = muiButtonPropsType["color"];
const color = (task: Task): colorType => {
  if (isSuccess(task) || isStart(task)) return "success";
  if (isFailure(task)) return "error";
  return "primary";
};

type variantType = muiButtonPropsType["variant"];
const variant = (task: Task): variantType => {
  if (isReady(task)) return "outlined";
  return "contained";
};

export { color, variant };

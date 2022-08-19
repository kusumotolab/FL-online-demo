type Ready = {
  readonly type: "ready";
};

type Start = {
  readonly type: "start";
};

type Running = {
  readonly type: "running";
};

type Success = {
  readonly type: "success";
};

type Failure = {
  readonly type: "failure";
};

type Task = Ready | Start | Running | Success | Failure;

const isReady = (task: Task): task is Ready => task.type === "ready";
const isStart = (task: Task): task is Start => task.type === "start";
const isRunning = (task: Task): task is Running => task.type === "running";
const isSuccess = (task: Task): task is Success => task.type === "success";
const isFailure = (task: Task): task is Failure => task.type === "failure";

const ready = (): Ready => ({ type: "ready" });
const start = (): Start => ({ type: "start" });
const running = (): Running => ({ type: "running" });
const success = (): Success => ({ type: "success" });
const failure = (): Failure => ({ type: "failure" });

export type { Ready, Running, Success, Failure, Task };
export { isReady, isStart, isRunning, isSuccess, isFailure };
export { ready, start, running, success, failure };

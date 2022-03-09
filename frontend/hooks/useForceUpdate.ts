import { useCallback, useState } from "react";

const useForceUpdate = () => {
  const [, newState] = useState({});
  return useCallback(() => newState({}), []);
};

export default useForceUpdate;

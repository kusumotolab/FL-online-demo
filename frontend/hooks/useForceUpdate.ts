import { useCallback, useState } from "react";

const useForceUpdate = () => {
  const [_, newState] = useState({});
  return useCallback(() => newState({}), []);
};

export default useForceUpdate;

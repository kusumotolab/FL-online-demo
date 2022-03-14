const KEY = {
  SRC: "src",
  TEST: "test",
} as const;

type Key = typeof KEY[keyof typeof KEY];

const getItem = (key: Key) => localStorage.getItem(key);

const removeItem = (key: Key) => localStorage.removeItem(key);

const setItem = (key: Key, value: string) => localStorage.setItem(key, value);

const clear = () => localStorage.clear();

export { KEY, getItem, removeItem, setItem, clear };

const setSessionStorage = <T>(key: string, value: T) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const getSessionStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};

export { setSessionStorage, getSessionStorage };

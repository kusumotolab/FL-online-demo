const checkFetchError = (resp: Response) => {
  if (resp.ok) return resp.json();
  throw Promise.reject(resp);
};

export default checkFetchError;

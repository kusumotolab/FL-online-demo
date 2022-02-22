const checkFetchError = (resp) => {
  if (resp.status >= 200 && resp.status <= 299) {
    return resp.json();
  }
  throw Error(resp);
};

export default checkFetchError;

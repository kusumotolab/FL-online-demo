const checkFetchError = async (resp: Response) => {
  if (resp.ok) return resp.json();
  let error;
  try {
    error = await resp.json();
  } catch {
    error = resp;
  }
  throw error;
};

export default checkFetchError;

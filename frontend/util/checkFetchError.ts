const checkFetchError = async (resp: Response) => {
  if (resp.ok) return resp.json();
  let error = resp;
  try {
    error = await resp.json();
  } catch {}
  throw error;
};

export default checkFetchError;

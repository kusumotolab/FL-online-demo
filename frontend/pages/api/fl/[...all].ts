import { config, proxy } from "../../../util/proxy";
import { NextApiRequest, NextApiResponse } from "next";

export { config };
export default (req: NextApiRequest, res: NextApiResponse) => {
  return proxy(req, res, {
    target: process.env.FL_API_HOST,
    changeOrigin: true,
  });
};

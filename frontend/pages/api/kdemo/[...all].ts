import { config, proxy } from "../../../util/proxy";
import { NextApiRequest, NextApiResponse } from "next";

export { config };
export default (req: NextApiRequest, res: NextApiResponse) =>
  proxy(req, res, {
    target: process.env.REPAIR_API_HOST,
    changeOrigin: true,
    pathRewrite: [
      {
        patternStr: "^/api/kdemo",
        replaceStr: "/api",
      },
    ],
    ws: true,
  });

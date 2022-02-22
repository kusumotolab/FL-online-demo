import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware, { NextHttpProxyMiddlewareOptions } from "next-http-proxy-middleware";

const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = (
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextHttpProxyMiddlewareOptions,
) => {
  return httpProxyMiddleware(req, res, options);
};

export { config, proxy };

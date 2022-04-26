/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: ".",

  // https://github.com/vercel/next.js/issues/18356#issuecomment-1017687918
  images: {
    loader: "custom",
  },

  webpack: (config, { dev, isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    };

    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries["main.js"] && !entries["main.js"].includes("./debug/whyDidYouRender.js")) {
          entries["main.js"].unshift("./debug/whyDidYouRender.js");
        }
        return entries;
      };
    }

    return config;
  },
  eslint: {
    dirs: ["./"],

    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

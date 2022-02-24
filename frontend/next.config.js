/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, {dev, isServer, defaultLoaders}) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    }

    if(dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./debug/whyDidYouRender.js')) {
          entries['main.js'].unshift('./debug/whyDidYouRender.js');
        }
        return entries;
      };
    }

    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/kdemo/:slug*',
        destination: process.env.REPAIR_API_ENDPOINT + '/api/:slug*', // Matched parameters can be used in the destination
      },
      {
        source: '/api/fl/:slug*',
        destination: process.env.FL_API_ENDPOINT + '/api/fl/:slug*', // Matched parameters can be used in the destination
      },
    ]
  }
}

module.exports = nextConfig

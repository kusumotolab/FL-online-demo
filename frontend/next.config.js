/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/kdemo/:slug*',
        destination: process.env.REPAIR_API_HOST + '/api/:slug*', // Matched parameters can be used in the destination
      },
      {
        source: '/api/fl/:slug*',
        destination: process.env.FL_API_HOST + '/api/fl/:slug*', // Matched parameters can be used in the destination
      },
    ]
  }
}

module.exports = nextConfig

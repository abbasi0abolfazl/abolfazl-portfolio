/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // برای دیسک‌های کند
  onError: (err, req, res) => {
    console.error(err);
  },
  // افزایش timeouts
  serverRuntimeConfig: {
    connectionTimeout: 60,
  },
}

module.exports = nextConfig

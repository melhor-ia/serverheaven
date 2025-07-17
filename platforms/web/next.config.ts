/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:5001/server-heaven-c6fb1/us-central1/api/:path*',
          },
        ]
      },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '9199',
            pathname: '/v0/b/**',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '/v0/b/**',
          },
          {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;

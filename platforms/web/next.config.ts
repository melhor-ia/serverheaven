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
        // The site is served entirely from Firebase Hosting without a dedicated
        // Next.js serverless function. This means the on-demand image
        // optimization route (`/_next/image`) is **not** available in
        // production. Enabling `unoptimized` ensures the <Image> component
        // falls back to the original `src` URL instead of requesting the
        // non-existent optimization endpoint, preventing 400/404 errors in
        // production while still working locally during development.
        unoptimized: true,
      },
};

export default nextConfig;

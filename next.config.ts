// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.auth0.com',
        pathname: '/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // Add any other image domains you might use
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // Other config options...
}

module.exports = nextConfig
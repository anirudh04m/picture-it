const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 
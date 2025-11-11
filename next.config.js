/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig

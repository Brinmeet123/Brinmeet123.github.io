/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use 'export' for GitHub Pages static deployment
  // Use 'standalone' for Docker (set via environment variable)
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : 'export',
  // GitHub Pages: if repo is username.github.io, no basePath needed
  // If repo is different name, use basePath: '/repo-name'
  // For brinmeet123.github.io, no basePath needed
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig


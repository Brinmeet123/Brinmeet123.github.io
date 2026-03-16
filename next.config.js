/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Output configuration:
  // - 'export' for static sites (GitHub Pages)
  // - 'standalone' for Docker
  // - undefined/default for Vercel (handled automatically)
  output: process.env.NEXT_OUTPUT === 'standalone' 
    ? 'standalone' 
    : process.env.NEXT_OUTPUT === 'export' 
      ? 'export' 
      : undefined,
  // GitHub Pages: if repo is username.github.io, no basePath needed
  // If repo is different name, use basePath: '/repo-name'
  // For brinmeet123.github.io, no basePath needed
  // Vercel: no basePath needed
  basePath: process.env.GITHUB_PAGES ? '' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '' : '',
}

module.exports = nextConfig


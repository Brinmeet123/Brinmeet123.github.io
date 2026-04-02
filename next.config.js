/** @type {import('next').NextConfig} */
// `next dev` must not use static-export / GitHub basePath — wrong combo breaks dev + chunk loading.
// argv check: survives a stray NODE_ENV=production while running `next dev`.
//
// If you see "missing required error components, refreshing..." or missing ./NNN.js chunks:
// 1) Stop every `next dev` (only one process may bind port 3001). 2) `npm run dev:clean`
//    (cleans .next, kills port 3001, starts dev with webpack cache off). 3) Hard-refresh the browser.
// Avoid deleting `.next` while `next dev` is running; disable "Console Ninja"–style extensions if they hook fs.
const isDevServer =
  process.argv.includes('dev') ||
  (process.env.NODE_ENV !== 'production' && !process.argv.includes('build'))

module.exports = {
  reactStrictMode: true,
  /**
   * Do not override chunkIds/moduleIds — that breaks Next.js App Router server chunks and causes
   * "Cannot find module './NNN.js'" after HMR. Only disable webpack filesystem cache in dev.
   * Opt in to cache with NEXT_DEV_WEBPACK_CACHE=1 (faster rebuilds, occasional chunk glitches possible).
   */
  webpack: (config, { dev }) => {
    if (dev && process.env.NEXT_DEV_WEBPACK_CACHE !== '1') {
      config.cache = false
    }
    return config
  },
  output: isDevServer
    ? undefined
    : process.env.NEXT_OUTPUT === 'standalone'
      ? 'standalone'
      : process.env.NEXT_OUTPUT === 'export'
        ? 'export'
        : undefined,
  ...(function () {
    const ghExport =
      !isDevServer &&
      process.env.NEXT_OUTPUT === 'export' &&
      String(process.env.GITHUB_PAGES) === 'true'
    const base =
      ghExport && process.env.GITHUB_PAGES_BASEPATH
        ? process.env.GITHUB_PAGES_BASEPATH
        : ''
    return ghExport
      ? {
          basePath: base,
          assetPrefix: base,
          trailingSlash: true,
        }
      : { basePath: '', assetPrefix: '' }
  })(),
}

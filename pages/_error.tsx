/**
 * Minimal Pages Router error page so the dev server can always resolve `/_error` chunks.
 * App Router still uses `app/error.tsx` / `app/global-error.tsx` for real errors.
 */
import type { NextPageContext } from 'next'

type Props = { statusCode?: number }

export default function ErrorPage({ statusCode }: Props) {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1 style={{ fontSize: 18 }}>{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? 500 : 404
  return { statusCode }
}

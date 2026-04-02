/** Fallback while route segments load (pairs with Suspense around async server work). */
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
      <div className="h-10 bg-slate-200/80 rounded-lg w-1/2 animate-pulse" />
      <div className="h-4 bg-slate-200/80 rounded w-full animate-pulse" />
      <div className="h-4 bg-slate-200/80 rounded w-11/12 animate-pulse" />
    </div>
  )
}

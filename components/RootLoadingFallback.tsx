/** Shown while the async session shell resolves (keeps root layout synchronous for stable dev HMR). */
export default function RootLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="h-16 border-b border-slate-200 bg-white shadow-sm" aria-hidden />
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-4">
        <div className="h-10 bg-slate-200/80 rounded-lg w-2/3 max-w-md animate-pulse" />
        <div className="h-4 bg-slate-200/80 rounded w-full animate-pulse" />
        <div className="h-4 bg-slate-200/80 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-slate-200/80 rounded w-4/6 animate-pulse" />
      </main>
    </div>
  )
}

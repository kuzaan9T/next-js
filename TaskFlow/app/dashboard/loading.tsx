export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading your board">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((column) => (
          <div key={column} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-100/70 p-3">
            <div className="h-5 w-24 rounded bg-slate-200" />
            {[0, 1].map((card) => (
              <div key={card} className="h-20 rounded-xl bg-white" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

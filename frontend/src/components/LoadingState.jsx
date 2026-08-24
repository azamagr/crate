export default function LoadingState() {
  return (
    <div className="rounded-xl border border-line bg-panel overflow-hidden animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-line last:border-b-0">
          <div className="w-4 h-4 rounded bg-line" />
          <div className="h-3.5 flex-1 bg-line rounded" />
          <div className="h-4 w-12 bg-line rounded-full" />
        </div>
      ))}
    </div>
  );
}

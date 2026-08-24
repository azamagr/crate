export default function LoadingState() {
  return (
    <div className="space-y-2" data-testid="loading-state">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 bg-panel border border-line rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

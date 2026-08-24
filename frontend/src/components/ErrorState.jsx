export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-14">
      <p className="text-sm text-muted">Couldn't load issues.</p>
      <p className="text-xs text-muted/70 font-mono mt-1">{message}</p>
      <button onClick={onRetry} className="text-sm text-coral font-medium mt-3 hover:underline">
        Try again
      </button>
    </div>
  );
}

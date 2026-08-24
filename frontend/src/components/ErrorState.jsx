import { CloudOff, RotateCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-14">
      <CloudOff className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
      <p className="text-sm text-muted mt-3">Couldn't load your tasks.</p>
      <p className="text-xs text-muted/70 font-mono mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 mt-4 text-sm text-blue font-medium hover:underline"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Try again
      </button>
    </div>
  );
}

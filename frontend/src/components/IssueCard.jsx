import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const PRIORITY_CLASSES = {
  low: "bg-low/10 text-low border-low/30",
  medium: "bg-medium/10 text-medium border-medium/30",
  high: "bg-high/10 text-high border-high/30",
};

const PRIORITY_BORDER = {
  low: "var(--color-low)",
  medium: "var(--color-medium)",
  high: "var(--color-high)",
};

export default function IssueCard({ issue, index, onDelete }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      style={{ borderLeftColor: PRIORITY_BORDER[issue.priority], borderLeftWidth: 3 }}
      className="flex items-start justify-between gap-3 bg-panel border border-line rounded-lg pl-3.5 pr-4 py-3"
    >
      <div className="min-w-0 flex items-start gap-2.5">
        <span className="font-mono text-[11px] text-muted/50 mt-0.5 shrink-0 select-none">
          {String(index + 1).padStart(4, "0")}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium truncate">{issue.title}</h3>
            <span
              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${PRIORITY_CLASSES[issue.priority]}`}
            >
              {issue.priority}
            </span>
          </div>
          {issue.description && <p className="text-xs text-muted mt-1 line-clamp-2">{issue.description}</p>}
        </div>
      </div>

      <button
        onClick={() => onDelete(issue._id)}
        aria-label={`Delete issue: ${issue.title}`}
        className="text-muted hover:text-coral transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.li>
  );
}

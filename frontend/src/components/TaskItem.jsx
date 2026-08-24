import { Trash2 } from "lucide-react";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 border-b border-line last:border-b-0">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        className="w-4 h-4 accent-blue"
      />

      <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted" : "text-ink"}`}>
        {task.title}
      </span>

      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${
          PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
        }`}
      >
        {task.priority}
      </span>

      <button
        onClick={() => onDelete(task._id)}
        aria-label={`Delete "${task.title}"`}
        className="text-muted hover:text-red transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

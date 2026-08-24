import { ClipboardList } from "lucide-react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-14">
        <ClipboardList className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
        <p className="text-sm text-muted mt-3">No tasks yet — add one above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="rounded-xl border border-line bg-panel overflow-hidden">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

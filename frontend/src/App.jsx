import { CheckCircle2 } from "lucide-react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { useTasks } from "./hooks/useTasks";

export default function App() {
  const {
    tasks,
    status,
    errorMessage,
    reload,
    addTask,
    creating,
    createError,
    setCreateError,
    toggleTask,
    removeTask,
  } = useTasks();

  return (
    <div className="min-h-screen bg-bg text-ink font-body">
      <div className="max-w-lg mx-auto px-5 py-10 sm:py-16">
        <div className="flex items-center gap-2 justify-center mb-8">
          <CheckCircle2 className="w-6 h-6 text-blue" strokeWidth={2.25} />
          <span className="font-display font-bold text-xl">Checkpoint</span>
        </div>

        <TaskForm
          onAdd={addTask}
          creating={creating}
          createError={createError}
          clearError={() => setCreateError("")}
        />

        <div className="mt-5">
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState message={errorMessage} onRetry={reload} />}
          {status === "success" && (
            <TaskList tasks={tasks} onToggle={toggleTask} onDelete={removeTask} />
          )}
        </div>

        <footer className="text-center text-xs text-muted/70 font-mono mt-10">
          Checkpoint · Express + MongoDB backend · Week 5 internship task
        </footer>
      </div>
    </div>
  );
}

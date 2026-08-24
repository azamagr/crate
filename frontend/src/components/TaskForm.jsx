import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { validateTitle, PRIORITIES } from "../utils/validators";

export default function TaskForm({ onAdd, creating, createError, clearError }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateTitle(title);
    setError(validationError);
    if (validationError) return;

    const ok = await onAdd({ title: title.trim(), priority });
    if (ok) {
      setTitle("");
      setPriority("medium");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-panel p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
            if (createError) clearError();
          }}
          placeholder="Add a task…"
          aria-label="Task title"
          className={`flex-1 bg-white border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${
            error ? "border-red" : "border-line focus:border-blue/60"
          }`}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority"
          className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue/60"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={creating}
          className="flex items-center justify-center gap-1.5 bg-blue text-blue-ink font-medium text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-60"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </div>

      {(error || createError) && (
        <p role="alert" className="text-xs text-red mt-2">
          {error || createError}
        </p>
      )}
    </form>
  );
}

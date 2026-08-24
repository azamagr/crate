import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { validateTitle } from "../utils/validators";

export default function IssueForm({ onCreate, creating, createError }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [titleError, setTitleError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validateTitle(title);
    setTitleError(error);
    if (error) return;

    const ok = await onCreate({ title: title.trim(), description: description.trim(), priority });
    if (ok) {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-line rounded-xl p-5 space-y-3">
      <div>
        <label htmlFor="issue-title" className="block text-xs font-medium text-muted mb-1.5">
          Title
        </label>
        <input
          id="issue-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError("");
          }}
          placeholder="Issue title"
          className={`w-full bg-bg border rounded-lg px-3.5 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none transition-colors ${
            titleError ? "border-coral" : "border-line focus:border-coral/60"
          }`}
        />
        {titleError && (
          <p role="alert" className="text-xs text-coral mt-1">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="issue-description" className="block text-xs font-medium text-muted mb-1.5">
          Description
        </label>
        <textarea
          id="issue-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          rows={3}
          className="w-full bg-bg border border-line rounded-lg px-3.5 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-coral/60 transition-colors resize-none"
        />
      </div>

      <div>
        <label htmlFor="issue-priority" className="block text-xs font-medium text-muted mb-1.5">
          Priority
        </label>
        <select
          id="issue-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full bg-bg border border-line rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-coral/60 transition-colors"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {createError && (
        <p role="alert" className="text-xs text-coral">
          {createError}
        </p>
      )}

      <button
        type="submit"
        disabled={creating}
        className="flex items-center gap-1.5 bg-coral text-coral-ink font-medium text-sm px-4 py-2 rounded-lg hover:brightness-110 transition disabled:opacity-50"
      >
        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {creating ? "Adding…" : "Add issue"}
      </button>
    </form>
  );
}

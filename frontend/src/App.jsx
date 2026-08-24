import { Bug } from "lucide-react";
import IssueForm from "./components/IssueForm";
import IssueList from "./components/IssueList";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { useIssues } from "./hooks/useIssues";

export default function App() {
  const { issues, status, errorMessage, reload, addIssue, creating, createError, removeIssue } = useIssues();

  return (
    <div className="min-h-screen bg-bg text-ink font-body">
      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Bug className="w-5 h-5 text-coral" strokeWidth={2.5} />
          <h1 className="font-display font-bold text-lg">Crate</h1>
        </div>

        <IssueForm onCreate={addIssue} creating={creating} createError={createError} />

        <div className="mt-6">
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState message={errorMessage} onRetry={reload} />}
          {status === "success" && <IssueList issues={issues} onDelete={removeIssue} />}
        </div>

        <footer className="text-center text-xs text-muted/60 font-mono mt-10">
          Crate · Express + MongoDB backend · Week 5 internship task
        </footer>
      </div>
    </div>
  );
}

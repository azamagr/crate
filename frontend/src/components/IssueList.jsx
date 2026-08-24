import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import IssueCard from "./IssueCard";

export default function IssueList({ issues, onDelete }) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-14">
        <Inbox className="w-8 h-8 text-muted mx-auto" strokeWidth={1.5} />
        <p className="text-sm text-muted mt-3">No issues yet — add one above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence mode="popLayout">
        {issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </ul>
  );
}

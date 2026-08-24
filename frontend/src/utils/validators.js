export function validateTitle(title) {
  if (!title.trim()) return "Title is required.";
  if (title.trim().length < 2) return "Title must be at least 2 characters.";
  if (title.trim().length > 120) return "Title can't be longer than 120 characters.";
  return "";
}

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

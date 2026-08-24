export function validateTitle(title) {
  if (!title.trim()) return "Title is required.";
  if (title.trim().length < 3) return "Title must be at least 3 characters.";
  if (title.trim().length > 120) return "Title can't be longer than 120 characters.";
  return "";
}

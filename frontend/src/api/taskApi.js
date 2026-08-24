const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return body.data;
}

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

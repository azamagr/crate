const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return body.data;
}

export async function fetchIssues() {
  const res = await fetch(`${API_URL}/api/issues`);
  return handleResponse(res);
}

export async function createIssue(payload) {
  const res = await fetch(`${API_URL}/api/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteIssue(id) {
  const res = await fetch(`${API_URL}/api/issues/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

import { useState, useEffect, useCallback } from "react";
import * as api from "../api/issuesApi";

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const data = await api.fetchIssues();
      setIssues(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message || "Couldn't load issues.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addIssue = useCallback(async (payload) => {
    setCreating(true);
    setCreateError("");
    try {
      const issue = await api.createIssue(payload);
      setIssues((prev) => [issue, ...prev]);
      return true;
    } catch (err) {
      setCreateError(err.message || "Couldn't create that issue.");
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const removeIssue = useCallback(async (id) => {
    const prev = issues;
    setIssues((list) => list.filter((i) => i._id !== id));
    try {
      await api.deleteIssue(id);
    } catch (err) {
      setIssues(prev);
      throw err;
    }
  }, [issues]);

  return { issues, status, errorMessage, reload: load, addIssue, creating, createError, removeIssue };
}

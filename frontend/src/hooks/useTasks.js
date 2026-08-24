import { useState, useEffect, useCallback } from "react";
import * as api from "../api/taskApi";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const data = await api.fetchTasks();
      setTasks(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message || "Couldn't load your tasks.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addTask = useCallback(async (payload) => {
    setCreating(true);
    setCreateError("");
    try {
      const task = await api.createTask(payload);
      setTasks((prev) => [task, ...prev]);
      return true;
    } catch (err) {
      setCreateError(err.message || "Couldn't create that task.");
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const toggleTask = useCallback(async (task) => {
    const updated = await api.updateTask(task._id, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
  }, []);

  const removeTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return {
    tasks,
    status,
    errorMessage,
    reload: load,
    addTask,
    creating,
    createError,
    setCreateError,
    toggleTask,
    removeTask,
  };
}

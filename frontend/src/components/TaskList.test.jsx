import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import TaskList from "./TaskList";

describe("TaskList", () => {
  test("renders an empty state when there are no tasks", () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test("renders one row per task when tasks are present", () => {
    const tasks = [
      { _id: "1", title: "First task", priority: "low", completed: false },
      { _id: "2", title: "Second task", priority: "medium", completed: false },
    ];
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });
});

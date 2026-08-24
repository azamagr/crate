import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import TaskItem from "./TaskItem";

const TASK = { _id: "abc123", title: "Write tests", priority: "high", completed: false };

describe("TaskItem", () => {
  test("renders the task title and priority badge", () => {
    render(<TaskItem task={TASK} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  test("calls onToggle with the task when the checkbox is clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TaskItem task={TASK} onToggle={onToggle} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(TASK);
  });

  test("calls onDelete with the task id when the delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskItem task={TASK} onToggle={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith("abc123");
  });

  test("shows completed tasks with strikethrough styling", () => {
    render(<TaskItem task={{ ...TASK, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Write tests")).toHaveClass("line-through");
  });
});

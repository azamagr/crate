import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import TaskForm from "./TaskForm";

function setup(props = {}) {
  const onAdd = vi.fn().mockResolvedValue(true);
  const clearError = vi.fn();
  render(
    <TaskForm onAdd={onAdd} creating={false} createError="" clearError={clearError} {...props} />
  );
  return { onAdd, clearError };
}

describe("TaskForm", () => {
  test("renders the title input, priority select, and add button", () => {
    setup();

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  test("shows a validation error and does not submit when the title is empty", async () => {
    const { onAdd } = setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/title is required/i);
    expect(onAdd).not.toHaveBeenCalled();
  });

  test("submits the trimmed title and chosen priority, then clears the form", async () => {
    const { onAdd } = setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/task title/i), "  Write tests  ");
    await user.selectOptions(screen.getByLabelText(/priority/i), "high");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith({ title: "Write tests", priority: "high" });
    expect(await screen.findByLabelText(/task title/i)).toHaveValue("");
  });
});

import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IssueForm from "../components/IssueForm";

describe("IssueForm", () => {
  test("renders the title, description, priority fields and submit button", () => {
    render(<IssueForm onCreate={vi.fn()} creating={false} createError="" />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add issue/i })).toBeInTheDocument();
  });

  test("shows a validation error and does not call onCreate when the title is empty", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<IssueForm onCreate={onCreate} creating={false} createError="" />);

    await user.click(screen.getByRole("button", { name: /add issue/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/title is required/i);
    expect(onCreate).not.toHaveBeenCalled();
  });

  test("shows a validation error when the title is too short", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<IssueForm onCreate={onCreate} creating={false} createError="" />);

    await user.type(screen.getByLabelText(/title/i), "Hi");
    await user.click(screen.getByRole("button", { name: /add issue/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 3 characters/i);
    expect(onCreate).not.toHaveBeenCalled();
  });

  test("submits the trimmed field values when the form is valid", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(true);
    render(<IssueForm onCreate={onCreate} creating={false} createError="" />);

    await user.type(screen.getByLabelText(/title/i), "  Fix the login bug  ");
    await user.type(screen.getByLabelText(/description/i), "Steps to reproduce...");
    await user.selectOptions(screen.getByLabelText(/priority/i), "high");
    await user.click(screen.getByRole("button", { name: /add issue/i }));

    expect(onCreate).toHaveBeenCalledWith({
      title: "Fix the login bug",
      description: "Steps to reproduce...",
      priority: "high",
    });
  });

  test("clears the form after a successful submission", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(true);
    render(<IssueForm onCreate={onCreate} creating={false} createError="" />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "A valid title");
    await user.click(screen.getByRole("button", { name: /add issue/i }));

    expect(await screen.findByLabelText(/title/i)).toHaveValue("");
  });

  test("disables the submit button and shows 'Adding…' while creating", () => {
    render(<IssueForm onCreate={vi.fn()} creating={true} createError="" />);

    const button = screen.getByRole("button", { name: /adding/i });
    expect(button).toBeDisabled();
  });

  test("shows a server-side error message when createError is set", () => {
    render(<IssueForm onCreate={vi.fn()} creating={false} createError="Something went wrong on the server" />);

    expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});

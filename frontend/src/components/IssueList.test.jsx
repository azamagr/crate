import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IssueList from "../components/IssueList";

const sampleIssues = [
  { _id: "1", title: "Fix login bug", description: "", priority: "high" },
  { _id: "2", title: "Update docs", description: "Add setup instructions", priority: "low" },
];

describe("IssueList", () => {
  test("renders a card for each issue", () => {
    render(<IssueList issues={sampleIssues} onDelete={vi.fn()} />);

    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Update docs")).toBeInTheDocument();
    expect(screen.getByText("Add setup instructions")).toBeInTheDocument();
  });

  test("shows an empty state when there are no issues", () => {
    render(<IssueList issues={[]} onDelete={vi.fn()} />);

    expect(screen.getByText(/no issues yet/i)).toBeInTheDocument();
    expect(screen.queryByText("Fix login bug")).not.toBeInTheDocument();
  });

  test("calls onDelete with the issue's id when its delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<IssueList issues={sampleIssues} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete issue: fix login bug/i }));

    expect(onDelete).toHaveBeenCalledWith("1");
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import * as issuesApi from "./api/issuesApi";

vi.mock("./api/issuesApi");

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("shows a loading state, then renders issues once the fetch resolves", async () => {
    issuesApi.fetchIssues.mockResolvedValue([
      { _id: "1", title: "Seeded issue", description: "", priority: "medium" },
    ]);

    render(<App />);

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();

    expect(await screen.findByText("Seeded issue")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-state")).not.toBeInTheDocument();
  });

  test("shows an error state with a retry option when the fetch fails", async () => {
    issuesApi.fetchIssues.mockRejectedValue(new Error("Network down"));

    render(<App />);

    expect(await screen.findByText(/couldn't load issues/i)).toBeInTheDocument();
    expect(screen.getByText(/network down/i)).toBeInTheDocument();

    issuesApi.fetchIssues.mockResolvedValue([]);
    const user = userEvent.setup();
    await user.click(screen.getByText(/try again/i));

    await waitFor(() => expect(issuesApi.fetchIssues).toHaveBeenCalledTimes(2));
  });
});

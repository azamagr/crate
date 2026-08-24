const { test, expect } = require("@playwright/test");

// A unique title per run so repeated test runs never collide with
// leftover data from a previous run against the real database.
const issueTitle = `E2E test issue ${Date.now()}`;

test("user can create an issue, see it appear in the list, and delete it", async ({ page }) => {
  await page.goto("/");

  // The board loads and the form is visible.
  await expect(page.getByRole("heading", { name: "Crate" })).toBeVisible();
  await expect(page.getByLabel("Title")).toBeVisible();

  // Fill out and submit the form — this hits the real backend.
  await page.getByLabel("Title").fill(issueTitle);
  await page.getByLabel("Description").fill("Created by the Playwright end-to-end test.");
  await page.getByLabel("Priority").selectOption("high");
  await page.getByRole("button", { name: "Add issue" }).click();

  // The new issue appears in the list without a page reload.
  const issueCard = page.getByText(issueTitle);
  await expect(issueCard).toBeVisible({ timeout: 10000 });

  // The form resets after a successful submission.
  await expect(page.getByLabel("Title")).toHaveValue("");

  // Delete the issue we just created.
  await page.getByRole("button", { name: `Delete issue: ${issueTitle}` }).click();

  // It's gone from the list — the delete actually round-tripped to the backend.
  await expect(page.getByText(issueTitle)).not.toBeVisible();
});

test("submitting an empty title shows a validation error and never hits the network", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add issue" }).click();

  await expect(page.getByRole("alert")).toContainText(/title is required/i);
});

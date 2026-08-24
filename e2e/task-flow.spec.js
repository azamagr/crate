const { test, expect } = require("@playwright/test");

test("create a task, see it appear, mark it complete, then delete it", async ({ page }) => {
  await page.goto("/");

  // Wait for the initial fetch to finish (loading skeleton gone) before
  // touching the form, so we're never racing the first page load.
  await expect(page.getByRole("list").or(page.getByText(/no tasks yet/i))).toBeVisible({
    timeout: 15_000,
  });

  const uniqueTitle = `E2E task ${Date.now()}`;

  // 1. Create a task
  await page.getByLabel("Task title").fill(uniqueTitle);
  await page.getByLabel("Priority").selectOption("high");
  await page.getByRole("button", { name: "Add" }).click();

  // 2. See it appear in the list — this round-trips to the real backend/DB,
  // so give it real time instead of the default.
  const taskRow = page.getByRole("listitem").filter({ hasText: uniqueTitle });
  await expect(taskRow).toBeVisible({ timeout: 15_000 });
  await expect(taskRow.getByText("high")).toBeVisible();

  // 3. Mark it complete
  await taskRow.getByRole("checkbox").check();
  await expect(taskRow.getByText(uniqueTitle)).toHaveClass(/line-through/, { timeout: 10_000 });

  // 4. Delete it
  await taskRow.getByRole("button", { name: /delete/i }).click();
  await expect(page.getByRole("listitem").filter({ hasText: uniqueTitle })).toHaveCount(0, {
    timeout: 10_000,
  });
});

test("shows a validation error instead of creating an empty task", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("alert")).toContainText(/title is required/i);
});

const { test, expect } = require("@playwright/test");

// This suite assumes both servers are already running locally:
//   backend:  npm run dev   (http://localhost:5000)
//   frontend: npm run dev   (http://localhost:5173)
// See the root README for the full setup.

test("create a task, see it appear, mark it complete, then delete it", async ({ page }) => {
  await page.goto("/");

  const uniqueTitle = `E2E task ${Date.now()}`;

  // 1. Create a task
  await page.getByLabel("Task title").fill(uniqueTitle);
  await page.getByLabel("Priority").selectOption("high");
  await page.getByRole("button", { name: "Add" }).click();

  // 2. See it appear in the list
  const taskRow = page.getByRole("listitem").filter({ hasText: uniqueTitle });
  await expect(taskRow).toBeVisible();
  await expect(taskRow.getByText("high")).toBeVisible();

  // 3. Mark it complete
  await taskRow.getByRole("checkbox").check();
  await expect(taskRow.getByText(uniqueTitle)).toHaveClass(/line-through/);

  // 4. Delete it
  await taskRow.getByRole("button", { name: /delete/i }).click();
  await expect(page.getByRole("listitem").filter({ hasText: uniqueTitle })).toHaveCount(0);
});

test("shows a validation error instead of creating an empty task", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("alert")).toContainText(/title is required/i);
});

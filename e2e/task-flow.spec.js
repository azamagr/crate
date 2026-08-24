const { test, expect } = require("@playwright/test");

test("create a task, see it appear, mark it complete, then delete it", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("list").or(page.getByText(/no tasks yet/i))).toBeVisible({
    timeout: 15_000,
  });

  const uniqueTitle = `E2E task ${Date.now()}`;

  // 1. Create a task
  await page.getByLabel("Task title").fill(uniqueTitle);
  await page.getByLabel("Priority").selectOption("high");

  // Wait for the actual POST /api/tasks response, and fail with the real
  // server message if it wasn't a success — this turns a vague "element
  // never appeared" timeout into a precise "here's what the API said".
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/tasks") && res.request().method() === "POST"),
    page.getByRole("button", { name: "Add" }).click(),
  ]);

  const body = await response.json().catch(() => ({}));
  expect(
    response.ok(),
    `POST /api/tasks returned ${response.status()}: ${body.message || JSON.stringify(body)}`
  ).toBeTruthy();

  // 2. See it appear in the list
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
const request = require("supertest");

// Mock the model entirely — these are unit/integration tests for the API layer
// (routes, controllers, validation, status codes), not for MongoDB itself.
// This also means the whole suite runs instantly and needs no database connection.
jest.mock("../src/models/Task", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Task = require("../src/models/Task");
const app = require("../src/app");

const SAMPLE_TASK = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  title: "Write the README",
  priority: "high",
  completed: false,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/tasks", () => {
  test("returns the list of tasks (happy path)", async () => {
    Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([SAMPLE_TASK]) });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([SAMPLE_TASK]);
  });

  test("returns an empty array when there are no tasks", async () => {
    Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe("POST /api/tasks", () => {
  test("creates a task and returns 201 (happy path)", async () => {
    Task.create.mockResolvedValue(SAMPLE_TASK);

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Write the README", priority: "high" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(SAMPLE_TASK);
    expect(Task.create).toHaveBeenCalledWith({ title: "Write the README", priority: "high" });
  });

  test("rejects an empty title with 400 (failure case)", async () => {
    const validationError = new Error("Task validation failed");
    validationError.name = "ValidationError";
    validationError.errors = { title: { message: "Title is required" } };
    Task.create.mockRejectedValue(validationError);

    const res = await request(app).post("/api/tasks").send({ title: "" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title is required/i);
  });
});

describe("PUT /api/tasks/:id", () => {
  test("updates a task (happy path)", async () => {
    const updated = { ...SAMPLE_TASK, completed: true };
    Task.findByIdAndUpdate.mockResolvedValue(updated);

    const res = await request(app).put(`/api/tasks/${SAMPLE_TASK._id}`).send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  test("returns 404 when the task doesn't exist (failure case)", async () => {
    Task.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put(`/api/tasks/${SAMPLE_TASK._id}`).send({ completed: true });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});

describe("DELETE /api/tasks/:id", () => {
  test("deletes a task (happy path)", async () => {
    Task.findByIdAndDelete.mockResolvedValue(SAMPLE_TASK);

    const res = await request(app).delete(`/api/tasks/${SAMPLE_TASK._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(SAMPLE_TASK);
  });

  test("returns 404 when deleting a task that doesn't exist (failure case)", async () => {
    Task.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete(`/api/tasks/${SAMPLE_TASK._id}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /unknown-route", () => {
  test("returns 404 for a route that doesn't exist", async () => {
    const res = await request(app).get("/api/nope");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

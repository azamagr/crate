const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("./setup");

describe("GET /api/issues", () => {
  test("returns an empty list when there are no issues yet", async () => {
    const res = await request(app).get("/api/issues");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  test("returns issues that were created", async () => {
    await request(app).post("/api/issues").send({ title: "Issue one" });
    await request(app).post("/api/issues").send({ title: "Issue two" });

    const res = await request(app).get("/api/issues");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

describe("POST /api/issues", () => {
  test("creates an issue with valid data (happy path)", async () => {
    const res = await request(app).post("/api/issues").send({
      title: "Login page crashes on submit",
      description: "Clicking submit with an empty password throws a client error.",
      priority: "high",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Login page crashes on submit");
    expect(res.body.data.priority).toBe("high");
    expect(res.body.data.status).toBe("open"); // default value
  });

  test("defaults to medium priority when none is given", async () => {
    const res = await request(app).post("/api/issues").send({ title: "No priority specified" });

    expect(res.status).toBe(201);
    expect(res.body.data.priority).toBe("medium");
  });

  test("rejects a missing title (failure case)", async () => {
    const res = await request(app).post("/api/issues").send({ description: "No title was sent" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title/i);
  });

  test("rejects a title that's too short (failure case)", async () => {
    const res = await request(app).post("/api/issues").send({ title: "Hi" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("rejects an invalid priority value (failure case)", async () => {
    const res = await request(app).post("/api/issues").send({
      title: "Valid title here",
      priority: "urgent-ish", // not one of low/medium/high
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/issues/:id", () => {
  test("deletes an existing issue (happy path)", async () => {
    const created = await request(app).post("/api/issues").send({ title: "Temporary issue" });
    const id = created.body.data._id;

    const res = await request(app).delete(`/api/issues/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);

    const afterDelete = await request(app).get("/api/issues");
    expect(afterDelete.body.data).toHaveLength(0);
  });

  test("returns 404 for an id that doesn't exist (failure case)", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/issues/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("returns 400 for a malformed id (failure case)", async () => {
    const res = await request(app).delete("/api/issues/not-a-valid-id");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

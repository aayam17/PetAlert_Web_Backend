const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index").app;
const LostAndFound = require("../models/LostAndFound");

let token;
let lostId;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);

  await request(app)
    .post("/api/auth/register")
    .send({
      username: "lostUser",
      email: "lost@gmail.com",
      password: "secret789",
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "lost@gmail.com",
      password: "secret789",
    });

  token = res.body.token;
});

afterAll(async () => {
  await LostAndFound.deleteMany({});
  await mongoose.disconnect();
});

describe("Lost and Found API", () => {
  test("should return 401 without token", async () => {
    const res = await request(app).get("/api/lostandfound");
    expect(res.statusCode).toBe(401);
  });

  test("should create lost item", async () => {
    const res = await request(app)
      .post("/api/lostandfound")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "Lost",
        description: "Black cat lost",
        location: "Central Park",
        date: "2025-08-10",
        time: "14:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe("Lost");
    lostId = res.body._id;
  });

  test("should get all lost and found entries", async () => {
    const res = await request(app)
      .get("/api/lostandfound")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should update lost item", async () => {
    const res = await request(app)
      .put(`/api/lostandfound/${lostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Updated description");
  });

  test("should delete lost item", async () => {
    const res = await request(app)
      .delete(`/api/lostandfound/${lostId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully.");
  });
});

  test("should fail to update with invalid ID", async () => {
    const res = await request(app)
      .put("/api/lostandfound/invalid123")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Invalid update" });

    expect(res.statusCode).toBe(500);
  });

  test("should not delete without token", async () => {
    const res = await request(app).delete(`/api/lostandfound/${lostId}`);
    expect(res.statusCode).toBe(401);
  });

  test("should return 404 for updating non-existent entry", async () => {
  const res = await request(app)
    .put(`/api/lostandfound/000000000000000000000000`)
    .set("Authorization", `Bearer ${token}`)
    .send({ description: "Non-existent" });

  expect(res.statusCode).toBe(404);
});

test("should return 404 for deleting non-existent entry", async () => {
  const res = await request(app)
    .delete(`/api/lostandfound/000000000000000000000000`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(404);
});
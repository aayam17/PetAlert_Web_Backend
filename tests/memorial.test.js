const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Memorial = require("../models/Memorial");

let token;
let memorialId;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);

  await request(app)
    .post("/api/auth/register")
    .send({
      username: "memUser",
      email: "mem@gmail.com",
      password: "secret456",
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "mem@gmail.com",
      password: "secret456",
    });

  token = res.body.token;
});

afterAll(async () => {
  await Memorial.deleteMany({});
  await mongoose.disconnect();
});

describe("Memorial API", () => {
  test("should return 401 without token", async () => {
    const res = await request(app).get("/api/memorials");
    expect(res.statusCode).toBe(401);
  });

  test("should create a memorial entry", async () => {
    const res = await request(app)
      .post("/api/memorials")
      .set("Authorization", `Bearer ${token}`)
      .send({
        petName: "Buddy",
        message: "We miss you",
        dateOfPassing: "2025-05-01",
        imageUrl: "http://example.com/photo.jpg",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.petName).toBe("Buddy");
    memorialId = res.body._id;
  });

  test("should get all memorials", async () => {
    const res = await request(app)
      .get("/api/memorials")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should update memorial", async () => {
    const res = await request(app)
      .put(`/api/memorials/${memorialId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Updated message" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Updated message");
  });

  test("should delete memorial", async () => {
    const res = await request(app)
      .delete(`/api/memorials/${memorialId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully.");
  });
});

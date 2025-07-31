const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index").app;
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);
  await User.deleteOne({ email: "test@gmail.com" });
});

afterAll(async () => {
  await User.deleteOne({ email: "test@gmail.com" });
  await mongoose.disconnect();
});

describe("Auth Tests", () => {
  test("should not register without email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "tester", password: "secret" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  test("should register successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "tester", email: "test@gmail.com", password: "secret" });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("should not register duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "tester", email: "test@gmail.com", password: "secret" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already registered");
  });

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@gmail.com", password: "secret" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("should not login with wrong email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@gmail.com", password: "secret" });

    expect(res.statusCode).toBe(400);
  });

  test("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@gmail.com", password: "wrong" });

    expect(res.statusCode).toBe(400);
  });
});

  test("should fail login with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "" });

    expect(res.statusCode).toBe(400);
  });

  test("should not register with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "X", email: "bademail", password: "123456" });

    expect(res.statusCode).toBe(400);
  });


test("should not login with empty fields", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "", password: "" });

  expect(res.statusCode).toBe(400);
});


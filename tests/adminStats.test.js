const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index").app;

let adminToken, userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);

  // Register admin
  await request(app)
    .post("/api/auth/register")
    .send({ username: "Admin", email: "admin@test.com", password: "admin123" });

  // Manually promote to admin
  const User = require("../models/User");
  await User.updateOne({ email: "admin@test.com" }, { role: "admin" });

  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "admin123" });

  adminToken = login.body.token;

  // Register normal user
  await request(app)
    .post("/api/auth/register")
    .send({ username: "User", email: "userx@test.com", password: "123456" });

  const loginUser = await request(app)
    .post("/api/auth/login")
    .send({ email: "userx@test.com", password: "123456" });

  userToken = loginUser.body.token;
});

afterAll(async () => {
  const User = require("../models/User");
  await User.deleteMany({ email: /@test\.com$/ });
  await mongoose.disconnect();
});

describe("Admin Stats Route", () => {
  test("should return stats for admin", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("appointments");
    expect(res.body).toHaveProperty("vaccinations");
    expect(res.body).toHaveProperty("lost");
    expect(res.body).toHaveProperty("memorials");
  });

  test("should deny access for normal user", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("should deny access with no token", async () => {
    const res = await request(app).get("/api/admin/stats");
    expect(res.statusCode).toBe(401);
  });

  test("should return proper data structure", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(typeof res.body.users).toBe("number");
    expect(typeof res.body.lost).toBe("number");
  });
});


test("should return 401 for invalid/malformed token", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", "Bearer invalidtoken");

  expect(res.statusCode).toBe(401);
});

test("should not return stats with expired token simulation", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", `Bearer `); // empty token

  expect(res.statusCode).toBe(401);
});

test("should return 401 for missing 'Bearer' prefix", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", `${adminToken}`); // missing 'Bearer '

  expect(res.statusCode).toBe(401);
});

test("should return 401 for malformed JWT structure", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", "Bearer abc.def"); // malformed token

  expect(res.statusCode).toBe(401);
});

test("should return 401 for malformed JWT structure", async () => {
  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", "Bearer abc.def"); // malformed token

  expect(res.statusCode).toBe(401);
});



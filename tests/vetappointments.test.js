const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index").app;
const VetAppointment = require("../models/VetAppointment");

let token;
let id;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);

  // Register user
  await request(app)
    .post("/api/auth/register")
    .send({ username: "vetuser", email: "vet@gmail.com", password: "pass" });

  // Login
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "vet@gmail.com", password: "pass" });

  token = res.body.token;
});

afterAll(async () => {
  await VetAppointment.deleteMany({});
  await mongoose.disconnect();
});

describe("Vet Appointments", () => {
  test("should fetch appointments", async () => {
    const res = await request(app).get("/api/vetappointments");
    expect(res.statusCode).toBe(200);
  });

  test("should not create appointment without token", async () => {
    const res = await request(app)
      .post("/api/vetappointments")
      .send({ date: "2025-10-10" });

    expect(res.statusCode).toBe(401);
  });

  test("should create appointment with token", async () => {
    const res = await request(app)
      .post("/api/vetappointments")
      .set("Authorization", `Bearer ${token}`)
      .send({ date: "2025-10-10", notes: "Checkup" });

    expect(res.statusCode).toBe(201);
    id = res.body._id;
  });

  test("should update appointment", async () => {
    const res = await request(app)
      .put(`/api/vetappointments/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ notes: "Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toBe("Updated");
  });

  test("should delete appointment", async () => {
    const res = await request(app)
      .delete(`/api/vetappointments/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});

test("should not update appointment without token", async () => {
  const res = await request(app)
    .put(`/api/vetappointments/${id}`)
    .send({ notes: "No token update" });

  expect(res.statusCode).toBe(401);
});

test("should return 404 for deleting non-existent appointment", async () => {
  const res = await request(app)
    .delete(`/api/vetappointments/000000000000000000000000`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(404);
});

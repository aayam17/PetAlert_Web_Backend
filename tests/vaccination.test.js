const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index").app;
const Vaccination = require("../models/VaccinationRecord");

let token;
let vaccinationId;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL);

  // Register user and get token
  await request(app)
    .post("/api/auth/register")
    .send({
      username: "vacUser",
      email: "vac@gmail.com",
      password: "secret123",
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "vac@gmail.com",
      password: "secret123",
    });

  token = res.body.token;
});

afterAll(async () => {
  await Vaccination.deleteMany({});
  await mongoose.disconnect();
});

describe("Vaccination Record API", () => {
  test("should return 401 without token", async () => {
    const res = await request(app).get("/api/vaccinationrecords");
    expect(res.statusCode).toBe(401);
  });

  test("should create a vaccination record", async () => {
    const res = await request(app)
      .post("/api/vaccinationrecords")
      .set("Authorization", `Bearer ${token}`)
      .send({
        vaccine: "Rabies",
        notes: "Booster shot",
        date: "2025-06-01",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.vaccine).toBe("Rabies");
    vaccinationId = res.body._id;
  });

  test("should get all vaccination records", async () => {
    const res = await request(app)
      .get("/api/vaccinationrecords")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should update vaccination record", async () => {
    const res = await request(app)
      .put(`/api/vaccinationrecords/${vaccinationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ notes: "Updated note" });

    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toBe("Updated note");
  });

  test("should delete vaccination record", async () => {
    const res = await request(app)
      .delete(`/api/vaccinationrecords/${vaccinationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully.");
  });
});


test("should not update vaccination with invalid ID", async () => {
  const res = await request(app)
    .put("/api/vaccinationrecords/invalidid123")
    .set("Authorization", `Bearer ${token}`)
    .send({ notes: "Invalid update" });

  expect(res.statusCode).toBe(500);
});

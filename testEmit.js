// testEmit.js
const { app } = require("./index"); // or "./server" depending on your file

const io = app.get("io");

io.emit("memorial:new", {
  petName: "Buddy",
  message: "We love you forever.",
  dateOfPassing: "2025-07-10",
  imageUrl: "",
});

console.log("Test event emitted!");

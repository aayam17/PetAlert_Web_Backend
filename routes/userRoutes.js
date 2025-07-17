const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { updateUser } = require("../controllers/userController");

router.put("/:id", upload.single("avatar"), updateUser);

module.exports = router;

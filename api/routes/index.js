const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const authRoutes = require("./auth");

router.get("/status", (req, res) => res.send("OK"));

router.use("/docs", express.static("docs"));
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, Products } = require("../models");

router.post("/", async (req, res) => {
    if (!req.body)
        return res.status(400).json({ message: "Request body is required" });

    const { username, password, firstName, lastName } = req.body;

    try {
        await User.create({ username, password, firstName, lastName });
        res.status(201).json({ message: "User added succesfully" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("firstName");
        res.status(200).json({ users });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User deleted succesfuly" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res
            .status(200)
            .json({ message: "User updated succesfuly", user });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get("/:userId/products", async (req, res) => {
    try {
        const foundProducts = await Products.find({ owner: req.params.userId });
        res.status(200).json({ foundProducts });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;

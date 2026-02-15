const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, Product } = require("../models");
const generateToken = require("../lib/auth");
const { checkToken } = require("../middleware/auth");

router.post("/", async (req, res) => {
    if (!req.body)
        return res.status(400).json({ message: "Request body is required" });

    const { username, password, firstName, lastName } = req.body;

    try {
        const user = await User.create({
            username,
            password,
            firstName,
            lastName,
        });
        const userObj = user.toObject();
        delete userObj.password;
        const token = generateToken(user);
        res.status(201).json({ user: userObj, token });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get("/", checkToken, async (req, res) => {
    try {
        const users = await User.find().select("firstName");
        res.status(200).json({ users });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete("/:id", checkToken, async (req, res) => {
    try {
        if (req.params.id !== req.user)
            return res.status(403).json({ message: "Forbidden" });
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User deleted succesfuly" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.patch("/:id", checkToken, async (req, res) => {
    try {
        if (req.params.id !== req.user)
            return res.status(403).json({ message: "Forbidden" });
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

router.get("/:userId/products", checkToken, async (req, res) => {
    try {
        const foundProducts = await Product.find({ owner: req.params.userId });
        res.status(200).json({ foundProducts });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).select(
            "+password",
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match)
            return res.status(401).json({ message: "Unauthorized login" });

        const token = generateToken(user);
        user.password = undefined;

        return res
            .status(200)
            .json({ message: "Successful login", user: user, token: token });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;

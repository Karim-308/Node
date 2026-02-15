const express = require("express");
const router = express.Router();
const { Product } = require("../models");

router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        );
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        return res
            .status(200)
            .json({ message: "Product updated succesfuly", product });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        return res.status(200).json({ message: "Product deleted succesfuly" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.patch("/:id/stock", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        if (req.body.operation === "restock") {
            product.quantity += req.body.quantity;
        } else if (req.body.operation === "destock") {
            if (product.quantity < req.body.quantity) {
                return res.status(400).json({ message: "Not enough stock" });
            }
            product.quantity -= req.body.quantity;
        } else {
            return res.status(400).json({ message: "Invalid operation" });
        }
        await product.save();
        res.status(200).json({ message: "Stock updated", product });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.status === "available") {
            filter.quantity = { $gt: 2 };
        } else if (req.query.status === "low stock") {
            filter.quantity = { $gt: 0, $lte: 2 };
        } else if (req.query.status === "out of stock") {
            filter.quantity = 0;
        }

        const product = await Product.find(filter)
            .limit(parseInt(req.query.limit)  || 10)
            .skip(parseInt(req.query.skip)  || 0);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        return res
            .status(200)
            .json({ message: "Product fetched succesfuly", products: product });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


module.exports = router;
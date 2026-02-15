const express = require("express");
const router = express.Router();
const { readInventory, writeInventory } = require("../lib/helpers");
const {
    validateId,
    validateQuantity,
    validateProduct,
} = require("../lib/validators");

router.get("/", (req, res) => {
    let inventory = readInventory() ?? [];

    if (inventory.length === 0) {
        res.status(200).json({ message: "Empty Inventory" });
        return;
    }

    const { status, category } = req.query;

    if (status) {
        inventory = inventory.filter((item) => item.status === status);
    }

    if (category) {
        inventory = inventory.filter((item) => item.category === category);
    }

    res.send(inventory);
});

router.get("/:id", validateId,(req, res) => {
    const inventory = readInventory() ?? [];

    if (inventory.length === 0) {
        res.status(200).json({ message: "Empty Inventory" });
        return;
    }



    const item = inventory.find((item) => parseInt(req.params.id) === item.id);

    if (!item) {
        res.status(404).json({
            message: "item " + req.params.id + " is not found",
        });
        return;
    }

    res.send(item);
});


router.post("/", validateProduct,(req, res) => {

    const inventory = readInventory() ?? [];
    const lastId =
        inventory.length > 0
            ? Math.max(...inventory.map((item) => item.id))
            : 0;

    const newItem = { ...req.body, id: lastId + 1 };
    inventory.push(newItem);

    writeInventory(inventory);
    res.status(201).json({ message: "Item added with id " + (lastId + 1) });
});

router.delete("/:id",validateId, (req, res) => {

    const inventory = readInventory() ?? [];

    if (inventory.length === 0) {
        res.status(200).json({ message: "Empty Inventory" });
        return;
    }

    const newInventory = inventory.filter(
        (item) => parseInt(req.params.id) !== item.id,
    );

    if (newInventory.length === inventory.length) {
        res.status(404).json({
            message: "item " + req.params.id + " is not found",
        });
        return;
    }

    writeInventory(newInventory);
    res.status(200).json({ message: "Item deleted with id " + req.params.id });
});

router.patch("/:id", validateId , validateProduct ,(req, res) => {
    
    const inventory = readInventory() ?? [];
    const item = inventory.find((item) => item.id === parseInt(req.params.id));

    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
    const updatedInventory = inventory.map((item) => {
        if (item.id === parseInt(req.params.id)) {
            return { ...item, ...req.body, id: item.id };
        }
        return item;
    });

    writeInventory(updatedInventory);

    res.status(200).json({ message: "Item updated with id " + req.params.id });
});

router.patch("/:id/restock",validateId,validateQuantity, (req, res) => {
   
    const inventory = readInventory() ?? [];
    const item = inventory.find((item) => item.id === parseInt(req.params.id));

    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }
    const updatedInventory = inventory.map((item) => {
        if (item.id === parseInt(req.params.id)) {
            return {
                ...item,
                quantity: item.quantity + parseInt(req.body.quantity),
            };
        }
        return item;
    });

    writeInventory(updatedInventory);

    res.status(200).json({ message: "Item updated with id " + req.params.id });
});

router.patch("/:id/destock",validateId,validateQuantity, (req, res) => {

    const inventory = readInventory() ?? [];
    const item = inventory.find((item) => item.id === parseInt(req.params.id));

    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }

    if (item.quantity < parseInt(req.body.quantity)) {
        res.status(400).json({ message: "Not enough stock" });
        return;
    }
    const updatedInventory = inventory.map((item) => {
        if (
            item.id === parseInt(req.params.id) &&
            item.quantity >= req.body.quantity
        ) {
            return {
                ...item,
                quantity: item.quantity - parseInt(req.body.quantity),
            };
        }
        return item;
    });

    writeInventory(updatedInventory);

    res.status(200).json({ message: "Item updated with id " + req.params.id });
});

module.exports = router;

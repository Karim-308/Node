function validateProduct(req, res, next) {
    if (!req.body.name) return res.status(400).json({ message: "Name is required" });
    if (req.body.price !== undefined && (isNaN(req.body.price) || req.body.price < 0))
        return res.status(400).json({ message: "Price must be a valid positive number" });
    if (req.body.quantity !== undefined && (isNaN(req.body.quantity) || req.body.quantity < 0))
        return res.status(400).json({ message: "Quantity must be a valid positive number" });
    next();
}

function validateId(req, res, next) {
    if (isNaN(req.params.id))
        return res.status(400).json({ message: "Valid ID is required" });
    else next(); 
}

function validateQuantity(req, res, next) {
    if (
        !req.body.quantity ||
        isNaN(req.body.quantity) ||
        req.body.quantity <= 0
    )
        return res.status(400).json({
            message: "Valid positive quantity is required",
        });
    else next();
}

module.exports = { validateProduct, validateId, validateQuantity };

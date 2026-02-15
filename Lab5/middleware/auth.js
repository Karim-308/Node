const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

function checkToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });
        const [_, token] = authHeader.trim().split(" ");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(400).json({ message: "Invalid Token" });

        req.user = decoded.id;

        next();
    } catch (e) {
        res.status(401).json({ message: e.message });
    }
}

async function verifyOwnership(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        if (product.owner.toString() !== req.user)
            return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}
module.exports = { checkToken, verifyOwnership };

function getStatus(quantity) {
    if (quantity > 2) return "available";
    if (quantity > 0) return "low stock";
    return "out of stock";
}

module.exports = { getStatus };

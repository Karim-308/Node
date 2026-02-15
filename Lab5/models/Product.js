const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        categories: {
            type: [String],
            default: ["General"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

productSchema.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);

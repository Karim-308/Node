const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 8,
        },

        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 15,
        },

        lastName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 15,
        },

        dob: {
            type: Date,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

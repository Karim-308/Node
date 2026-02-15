const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
            select: false,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

module.exports = mongoose.model("User", userSchema);

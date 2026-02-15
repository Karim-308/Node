const express = require("express")
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/inventory");
const app = express();
const { usersRouter, productsRouter } = require("./routes");


app.use(express.json());
app.use('/users',usersRouter)
app.use('/product', productsRouter)
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});


app.listen(3000, () => {
    console.log("Server up and running on port 3000");
});
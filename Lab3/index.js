const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const { readInventory } = require("./lib/helpers");

app.use(express.json());
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
    const inventory = readInventory() ?? [];
    res.render("home", { items: inventory });
});
app.use(express.static("public"));
app.use("/products", productsRouter);

app.listen(3000);

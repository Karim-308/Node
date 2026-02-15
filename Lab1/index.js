import fs from "fs";

export function checkFileExists(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

const [, , commands, ...values] = process.argv;

if (commands === "add") {
  const [name] = values;

  const inventory = readInventory() ?? [];

  const lastId =
    inventory.length > 0 ? Math.max(...inventory.map((item) => item.id)) : 0;
  const newItem = {
    name: name,
    id: lastId + 1,
    quantity: 1,
    category: "General",
  };
  inventory.push(newItem);
  fs.writeFileSync("../inventory.json", JSON.stringify(inventory));
}

if (commands === "destock") {
  const [id, quantity] = values;
  const parsedId = parseInt(id);
  const parsedQty = parseInt(quantity);

  const inventory = readInventory();

  if (!inventory) {
    console.log("The inventory does not exist or invalid.");  //TODO: TOO MUCH DETAILA FOR THE USER
    process.exit();
  }

  let item = inventory.find((item) => item.id === parsedId); //Todo: be const until you wanna change in ti
  if (item) {
    const updatedArray = inventory.map((item) => {
      if (item.id === parsedId) {
        if (item.quantity >= parsedQty) {
          return { ...item, quantity: item.quantity - parsedQty };
        } else {
          console.log(
            `There is not enough inventory for the item with id ${parsedId}. please Add or Restock the items`,
          );
        }
        return item;
      } else return item;
    });

    fs.writeFileSync("../inventory.json", JSON.stringify(updatedArray));
  }
}

if (commands === "restock") {
  const [id, quantity] = values;
  const parsedId = parseInt(id);
  const parsedQty = parseInt(quantity);

  const inventory = readInventory();

  if (!inventory) {
    console.log("The inventory does not exist or invalid.");
    process.exit();
  }

  if (inventory.length === 0) {
    console.log("The inventory is empty");
    process.exit();
  }
  let item = inventory.find((item) => item.id === parsedId);
  if (item) {
    const updatedArray = inventory.map((item) => {
      if (item.id === parsedId) {
        return { ...item, quantity: item.quantity + parsedQty };
      } else return item;
    });

    fs.writeFileSync("../inventory.json", JSON.stringify(updatedArray));
  }
}

if (commands === "edit") {
  const [id, newName] = values;
  const parsedId = parseInt(id);

  const inventory = readInventory();
  if (!inventory) {
    console.log("The inventory does not exist or invalid.");
    process.exit();
  }

  if (inventory.length === 0) {
    console.log("The inventory is empty");
    process.exit();
  }

  let item = inventory.find((item) => item.id === parsedId);
  if (item) {
    const updatedArray = inventory.map((item) => {
      if (item.id === parsedId) {
        return { ...item, name: newName };
      } else return item;
    });

    fs.writeFileSync("../inventory.json", JSON.stringify(updatedArray));
  } else
    console.log(
      "This item does not exist in the inventory. Add or Restock the items",
    );
}

if (commands === "delete") {
  const [id] = values;
  const parsedId = parseInt(id);

  const inventory = readInventory();
  if (!inventory) {
    console.log("The inventory does not exist or invalid.");
    process.exit();
  }

  if (inventory.length === 0) {
    console.log("The inventory is empty");
    process.exit();
  }

    const updatedArray = inventory.filter((item) => item.id !== parsedId);

    fs.writeFileSync("../inventory.json", JSON.stringify(updatedArray));
    // TODO: COMPARRE LENGTHS
}

if (commands === "list") {
  const inventory = readInventory();
  if (!inventory) {
    console.log("The inventory does not exist or invalid.");
    process.exit();
  }

  if (inventory.length === 0) {
    console.log("The inventory is empty");
    process.exit();
  }
  const inventoryTable = inventory.map((item) => {
    return {
      ...item,
      status:
        item.quantity > 2
          ? "available"
          : item.quantity > 0 && item.quantity <= 2
            ? "low stock"
            : item.quantity === 0
              ? "out of stock"
              : "",
    };
  });

  console.table(inventoryTable);
}

if (commands === "summary") {
  let totalQuantity = 0;
  let lowStock = 0;
  let outOfStock = 0;
  let inStock = 0;

  const inventory = readInventory();
  if (!inventory) {
    console.log("The inventory does not exist or invalid.");
    process.exit();
  }

  if (inventory.length === 0) {
    console.log("The inventory is empty");
    process.exit();
  }

  inventory.forEach((item) => {
    totalQuantity += item.quantity;
    if (item.quantity > 2) inStock++;
    else if (item.quantity > 0 && item.quantity <= 2) lowStock++;
    else if (item.quantity === 0) outOfStock++;
  });

  console.log("Total Items Number = " + inventory.length);
  console.log("Total Quantity = " + totalQuantity);
  console.log("Low Stock Count = " + lowStock);
  console.log("Out Of Stock Count = " + outOfStock);
  console.log("In Stock Count = " + inStock);
}

export function readInventory() {
  if (!checkFileExists("../inventory.json")) {
    return null;
  }
  const inventoryData = fs.readFileSync("../inventory.json", "utf-8");

  try {
    const inventory = JSON.parse(inventoryData);
    if (!Array.isArray(inventory)) return null;
    return inventory;
  } catch (e) {
    return null;
  }
}

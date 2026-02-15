const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, '../../inventory.json');

function readInventory() {
  if (!checkFileExists(inventoryPath)) {
    return null;
  }
  const inventoryData = fs.readFileSync(inventoryPath, "utf-8");

  try {
    const inventory = JSON.parse(inventoryData);
    if (!Array.isArray(inventory)) return null;
    return inventory;
  } catch (e) {
    return null;
  }
}

function writeInventory(inventory) {
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
}

 function checkFileExists(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

module.exports = { writeInventory, readInventory };

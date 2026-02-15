const http = require("http");
const fs = require("fs");
const path = require("path");
const { readInventory } = require("../Lab1/index.js");

const imagesContentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let stream;
  if (req.url === "/") {
    const inventory = readInventory() ?? [];

    const items = inventory
      .map((item) => {
        return `<div>
       <h3>${item.name}</h3>
    <ul>
      <li>Quantity: ${item.quantity}</li>
      <li>Category: ${item.category}</li>      
    </ul>
    </div>

`;
      })
      .join("");

    const HomePage = buildHome(items);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HomePage);
    return;
  }
   else if (req.url === "/astronomy") {
    stream = fs.createReadStream("pages/astronomy.html");
    res.writeHead(200, { "Content-Type": "text/html" });
  } 
  else if (req.url === "/astronomy/download") {
    stream = fs.createReadStream("images/astronomy.jpg");
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Disposition": "attachment; filename=astronomy.jpg",
    });
  } 
  else if (req.url === "/serbal") {
    stream = fs.createReadStream("pages/serbal.html");
    res.writeHead(200, { "Content-Type": "text/html" });
  } 
  else if (req.url === "/styles/styles.css") {
    stream = fs.createReadStream("styles/styles.css");
    res.writeHead(200, { "Content-Type": "text/css" });
  }
   else if (req.url.startsWith("/images/")) {
    const filePath = "." + req.url; //./images/file.jpg
    const ext = path.extname(filePath);
    const contentType = imagesContentTypes[ext] || "application/octet-stream";
    stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": contentType });
  } 
  else if (req.method === "POST" && req.url === "/inventory") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const inventory = readInventory() ?? [];
      const lastId =
        inventory.length > 0
          ? Math.max(...inventory.map((item) => item.id))
          : 0;
      try {
        const parsed = JSON.parse(body);
        const newItem = { ...parsed, id: lastId + 1 };
        inventory.push(newItem);
        fs.writeFileSync("../inventory.json", JSON.stringify(inventory));
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("Item added");
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

    });
  }
   else {
    stream = fs.createReadStream("pages/404.html");
    res.writeHead(404, { "Content-Type": "text/html" });
  }

  if (stream) stream.pipe(res);
});

server.listen(3000);


function buildHome(itemsHtml) {
  return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/styles/styles.css">
</head>
<body>
    <h1>Available inventory</h1>
    ${itemsHtml}
</body>
</html>
`;
}

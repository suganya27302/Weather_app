const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((request, response) => {
    let filePath = `..${request.url}`;
    console.log(filePath);
    if (request.url === "/") {
      filePath = "../index.html";
    }
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };
    const contentType = mimeTypes[extname] ?? "application/octet-stream";
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          fs.readFile("./404.html", (error, content) => {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            `Sorry, check with the site admin for error: ${error.code} ..\n`
          );
        }
      } else {
        console.log(extname + " " + contentType);
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(8125);
console.log("Server running at http://127.0.0.1:8125/");

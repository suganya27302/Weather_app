const http = require("http");
const fs = require("fs");
const path = require("path");
const timeZone = require("../DATA/timeZone.js");
const url = require("url");
let startTime = new Date();
let dayCheck = 4;
let weatherData;
let cityName;
let nextFiveHrsTemp;
http
  .createServer((request, response) => {
    let filePath = `..${request.url}`;
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
          response.writeHead(404, { "Content-Type": "text/plain" });
          response.end("404 page not found");
        } else {
          response.writeHead(500);
          response.end(
            `Sorry, check with the site admin for error: ${error.code} ..\n`
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(8125);
console.log("Server running at http://127.0.0.1:8125/");

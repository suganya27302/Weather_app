// import neccessary module
const http = require("http");
const fs = require("fs");
const path = require("path");
const timeZone = require("./timeZone.js");
const url = require("url");

let startTime = new Date();
let dayCheck = 14400000;
let weatherData = [];
let cityName;
let nextFiveHrsTemp;

// local server creation
http
  .createServer((request, response) => {
    let currentTime = new Date();
    let query = request.url.split("=")[0];
    let cityInfo = url.parse(request.url).query;
    const SearchParams = new URLSearchParams(cityInfo);
    let nameOfTheCity = SearchParams.get("city");

    // Respond to the request to fetch all cities data
    if (request.url == "/all-timezone-cities") {
      let differenceTime = currentTime - startTime;

      if (differenceTime > dayCheck) {
        startTime = new Date();
        weatherData = timeZone.allTimeZones();
        //console.log(weatherData);
        response.write(JSON.stringify(weatherData));
        response.end();
      } else {
        if (weatherData.length === 0) {
          weatherData = timeZone.allTimeZones();
        }
        response.write(JSON.stringify(weatherData));
        response.end();
      }
    }

    // Respond to the request to fetch the city information
    if (query == "/?city") {
      if (nameOfTheCity) {
        cityName = timeZone.timeForOneCity(nameOfTheCity);
        response.write(JSON.stringify(cityName));
        response.end();
      } else {
        response.writeHead(404);
        response.end("Not a Valid Endpoint. Please check API doc");
      }
    }

    // Respond to the request to fetch next five hours temperature value
    if (request.url == "/hourly-forecast" && request.method == "POST") {
      let cityData = "";
      request.on("data", (chunk) => {
        cityData += chunk.toString();
      });
      request.on("end", () => {
        cityData = JSON.parse(cityData);
        if (cityData) {
          nextFiveHrsTemp = timeZone.nextNhoursWeather(
            cityData.city_Date_Time_Name,
            cityData.hours,
            weatherData
          );
          response.write(JSON.stringify(nextFiveHrsTemp));
          response.end();
        } else {
          response.writeHead(404);
          response.end("Not a Valid Endpoint. Please check API doc");
        }
      });
    }
    // HTTP request to render the HTML file when the user enters the specific port

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

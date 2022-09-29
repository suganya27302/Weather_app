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

/**
 * Local server to handle request and response back to the client.
 * if the request is invalid it display a error message
 *  orelse it fetch the data and return response.
 * */
http
  .createServer((request, response) => {
    let currentTime = new Date();
    let query = request.url.split("=")[0];
    let cityInfo = url.parse(request.url).query;
    const SearchParams = new URLSearchParams(cityInfo);
    let nameOfTheCity = SearchParams.get("city");

    /**
     * Respond to the request to fetch all cities data.
     * Every four hours once, it will update the all cities data and
     * respond to the client.
     */
    if (request.url == "/all-timezone-cities") {
      let differenceTime = currentTime - startTime;

      if (differenceTime > dayCheck) {
        startTime = new Date();
        weatherData = timeZone.allTimeZones();
        response.write(JSON.stringify(weatherData));
        response.end();
      } else {
        if (weatherData.length === 0) {
          weatherData = timeZone.allTimeZones();
        }
        response.write(JSON.stringify(weatherData));
        response.end();
      }
    } else if (query == "/?city") {
      /**
       * Respond to the request to fetch the city information
       * When the url is with a city query, it fetch the selected city information
       * and respond back to the client.
       * If it unable to call the function it displays error message to page.
       */
      if (nameOfTheCity) {
        cityName = timeZone.timeForOneCity(nameOfTheCity);
        response.write(JSON.stringify(cityName));
        response.end();
      } else {
        response.writeHead(404);
        response.end("Not a Valid Endpoint. Please check API doc");
      }
    } else if (request.url == "/hourly-forecast" && request.method == "POST") {
      /**
       * When the url with hourly-forecast and post request
       * it capture the chunk data and used as a parameter to fetch the next five hours temperature
       * and respond back to the client.
       * If it unable to call the function it displays error message to page.
       * */
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
    } else {
    /**
     * HTTP request to render the HTML file when the user enters the specific port
     */
      let filePath = `..${request.url}`;
      // It renders the index page when the url enters.
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
      // if the extension type is not in object , default content type is taken.
      const contentType = mimeTypes[extname] ?? "application/octet-stream";

      fs.readFile(filePath, (error, content) => {
        if (error) {
          // when there is issue with file directories path it executes.
          if (error.code === "ENOENT") {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("404 page not found");
          }
          // when there is issue with server in accessing file , it executes.
          else {
            response.writeHead(500);
            response.end(
              `Sorry, check with the site admin for error: ${error.code} ..\n`
            );
          }
        }
        // It executes, when the content type matches with the extension.
        else {
          response.writeHead(200, { "Content-Type": contentType });
          response.end(content, "utf-8");
        }
      });
    }
  })
  .listen(8125);

console.log("Server running at http://127.0.0.1:8125/");

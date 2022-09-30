/**
 * Importing the neccessary packages.
 */
const express = require("express");
const path = require("path");
const app = express();
const timezone = require("./JAVASCRIPT/timeZone.js");
const bodyParser = require("body-parser");
let startTime = new Date();
let weatherData = [];
let dayCheck = 14400000;
let cityName;

/**
 * body-parser, which is used to fetch input data from body.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Render the Webpage using the middleware.
 */
app.use("/", express.static("./"));

/**
 * Respond to the request to fetch all cities data.
 * Every four hours once, it will update the all cities data and
 * respond to the client.
 */
app.get("/all-timezone-cities", function (request, response) {
  let currentTime = new Date();
  if (currentTime - startTime > dayCheck) {
    startTime = new Date();
    weatherData = timezone.allTimeZones();
    response.json(weatherData);
  } else {
    if (weatherData.length === 0) {
      weatherData = timezone.allTimeZones();
    }
    response.json(weatherData);
  }
});

/**
 * Respond to the request to fetch the city information
 * When the url is with a city query, it fetch the selected city information
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.get("/city", function (request, response) {
  let city = request.query.city;
  if (city) {
    cityName = timezone.timeForOneCity(city);
    response.json(cityName);
  } else {
    response
      .status(404)
      .json("Error: Not a valid Endpoint. Please check API Doc.");
  }
});

/**
 * When the url with hourly-forecast and post request
 * it capture the chunk data and used as a parameter to fetch the next five hours temperature
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.post("/hourly-forecast", function (request, response) {
  let cityDTN = request.body.city_Date_Time_Name;
  let hours = request.body.hours;
  if (cityDTN && hours) {
    response.json(timezone.nextNhoursWeather(cityDTN, hours, weatherData));
  } else {
    response
      .status(404)
      .json("Error: Not a valid Endpoint. Please check API Doc.");
  }
});

// if the request is invalid it display a error message
app.get("*", (request, response) => {
  response.send("404! This is an invalid URL.");
});

/**
 *  Local server to handle request and response back to the client.
 *  if the request is invalid it display a error message
 *  orelse it fetch the data and return response.
 */
app.listen(8125);
console.log("Server listening at http://127.0.0.1:8125/");

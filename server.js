/**
 * Importing the neccessary packages.
 */
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const { fork } = require("child_process");
let startTime = new Date();
let weatherData = [];
let dayCheck = 14400000;

/**
 * body-parser, which is used to fetch input data from body.
 * extended is set to false, it returns objects.
 * Note: If extended is set to true it returns object of objects
 * and qslibrary is used to parse object
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Render the Webpage using the middleware.
 */
app.use("/", express.static("./"));

/**
 * Respond to the request to fetch all cities data.
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * Every four hours once, the request is raised from index.js
 * it will update the all cities data and
 * respond to the client.
 */
app.get("/all-timezone-cities", function (request, response) {
  let allTimezon = fork(__dirname + "/JAVASCRIPT/timeZone.js");
  allTimezon.on("message", (weatherinfo) => {
    weatherData = weatherinfo;
    response.json(weatherinfo);
  });
  let currentTime = new Date();
  if (currentTime - startTime > dayCheck) {
    startTime = new Date();
    allTimezon.send("GetData");
  } else {
    if (weatherData.length === 0) {
      allTimezon.send("GetData");
    }
  }
});

/**
 * Respond to the request to fetch the city information
 * To avoid conflict, the route path is taken as '/city'.
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * When the url is with a city query, it fetch the selected city information
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.get("/city", function (request, response) {
  let city = request.query.city;

  let cityInfo = fork(__dirname + "/JAVASCRIPT/timeZone.js");
  cityInfo.on("message", (cityData) => {
    response.json(cityData);
  });
  if (city) {
    cityInfo.send({ Sendmessage: "GetcityInfo", cityname: `${city}` });
  } else {
    response
      .status(404)
      .json("Error: Not a valid Endpoint. Please check API Doc.");
  }
});

/**
 * When the url with hourly-forecast and post request
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * captured data from body is used as a parameter to fetch the next five hours temperature
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.post("/hourly-forecast", function (request, response) {
  let cityDTN = request.body.city_Date_Time_Name;
  let hours = request.body.hours;
  let temperature = fork(__dirname + "/JAVASCRIPT/timeZone.js");
  let cityData = {
    Sendmessage: "GetTemperature",
    cityDTN: cityDTN,
    hours: hours,
    weatherData: weatherData,
  };
  temperature.on("message", (nextFiveHrs) => {
    response.json(nextFiveHrs);
  });

  if (cityDTN && hours) {
    temperature.send(cityData);
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

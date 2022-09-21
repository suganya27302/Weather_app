import {
  appendCitynameToDropdown,
  updateDataOnCityname,
} from "/JAVASCRIPT/utility.js";

function fetchweatherData() {
  let response = new Promise(async (resolve, reject) => {
    let weatherData = await fetch(
      `https://soliton.glitch.me/all-timezone-cities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    resolve(weatherData);
  });
  return response;
}

function fetchCityName(selectedCity) {
  let response = new Promise(async (resolve, reject) => {
    let cityName = await fetch(
      `https://soliton.glitch.me?city=${selectedCity}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    resolve(cityName);
  });
  return response;
}

function fetchNextFivehrs(nameOfCity) {
  let response = new Promise(async (resolve, reject) => {
    let weatherData = await fetch(`https://soliton.glitch.me/hourly-forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nameOfCity),
    });
    resolve(weatherData);
  });
  return response;
}

let weatherData;
let liveDataOfCities;
let nameOfCity;
let cityName;
let nextFiveHrs;

function updateKeyValue(array, key) {
  return array.reduce((object, item) => {
    object[item[key].toLowerCase()] = item;
    return object;
  }, {});
}
async function getWeatherData() {
  let response = await fetchweatherData();
  liveDataOfCities = await response.json();

  for (let city of liveDataOfCities) {
    nameOfCity = city.cityName;
    let response_of_city = await fetchCityName(nameOfCity);
    cityName = await response_of_city.json();
    cityName.hours = 6;
    let response_of_nextFivehrs = await fetchNextFivehrs(cityName);
    nextFiveHrs = await response_of_nextFivehrs.json();
    city.nextFiveHrs = nextFiveHrs.temperature;
    weatherData = await updateKeyValue(liveDataOfCities, "cityName");
    //console.log(weatherData);
  }
}

getWeatherData().then(
  () => {
    appendCitynameToDropdown(weatherData);
    updateDataOnCityname();
  },
  (error) => console.log(error)
);

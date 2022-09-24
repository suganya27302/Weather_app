/**
 * The function, which is used to fetch the live weather data through api.
 * @params {} nothing
 * @return {Promise} response
 */
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
    if (weatherData.ok) resolve(weatherData.json());
    else reject("Something went wrong..");
  });
  return response;
}

/**
 * The function, which is used to fetch the city information through api.
 * @params {} nothing
 * @return {Promise} response
 */
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
    if (cityName.ok) resolve(cityName.json());
    else reject("Something went wrong..");
  });
  return response;
}

/**
 * The function, which is used to fetch the live temperature value for next five hours
 * through api.
 * @params {string} nameOfCity
 * @return {Promise} response
 */
function fetchNextFivehrs(nameOfCity) {
  let response = new Promise(async (resolve, reject) => {
    let nextFiveHrs = await fetch(`https://soliton.glitch.me/hourly-forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nameOfCity),
    });
    if (nextFiveHrs.ok) resolve(nextFiveHrs.json());
    else reject("Something went wrong..");
  });
  return response;
}

/**
 *
 * The function, which will replace the key value with the cityname.
 * @param {array} array
 * @param {string} key
 * @return {array} object weatherData
 */
function updateKeyValue(array, key) {
  return array.reduce((object, item) => {
    object[item[key].toLowerCase()] = item;
    return object;
  }, {});
}

/**
 *
 * The function will fetch next five hours temperature value and append to the object.
 * @param {string} nameOfCity Selected city name
 * @param {object} weatherData Object
 */
async function appendNextFivehrs(nameOfCity, weatherData) {
  let nextFiveHrs;
  let cityName;
  cityName = await fetchCityName(nameOfCity);
  cityName.hours = 6;

  nextFiveHrs = await fetchNextFivehrs(cityName);
  setInterval(async () => {
    nextFiveHrs = await fetchNextFivehrs(cityName);
  }, 3600000);
  weatherData[nameOfCity.toLowerCase()].nextFiveHrs = nextFiveHrs.temperature;
}

/**
 * the function, which is used to call the functions, which are responsible for
 * fetch the live weather data.
 * @params {} nothing
 * @return {object} weatherDetails
 */
async function getWeatherData() {
  let liveDataOfCities;
  let weatherDetails;
  try {
    liveDataOfCities = await fetchweatherData();
    setInterval(async () => {
      response = await fetchweatherData();
    }, 14400000);
    weatherDetails = updateKeyValue(liveDataOfCities, "cityName");
  } catch (error) {
    console.log(error);
  }
  return weatherDetails;
}

export { getWeatherData, appendNextFivehrs };

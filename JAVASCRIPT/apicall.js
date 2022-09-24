/**
 * fetch the live weather data by sending a
 * get request to the server.
 * @params {} nothing
 * @return {Promise} response
 */
function sendHttpRequestTofetchweatherData() {
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
 * fetch the current city information by sending a
 * get request and taking the current city as input.
 * @params {selectedCity} Current city
 * @return {Promise} response
 */
function sendHttpRequestTofetchCityInformation(selectedCity) {
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
 * fetch the live temperature value for next five hours
 * by sending a current city information through the post request.
 * @params {string} nameOfCity
 * @return {Promise} response
 */
function sendHttpRequestTofetchNextFivehrsTemperature(nameOfCity) {
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
 * Replace the key value with the cityname.
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
 * fetch the city information and Temperature value for next five hours.
 * @param {string} nameOfCity current city
 * @param {object} weatherData Weather details
 * @returns {void} nothing
 */
async function fetchNextFivehrsForTheCity(nameOfCity, weatherData) {
  let nextFiveHrs;
  let cityInfo;
  cityInfo = await sendHttpRequestTofetchCityInformation(nameOfCity);
  cityInfo.hours = 6;
  nextFiveHrs = await sendHttpRequestTofetchNextFivehrsTemperature(cityInfo);
  weatherData[nameOfCity.toLowerCase()].nextFiveHrs = nextFiveHrs.temperature;
}
/**
 *
 *  fetch next five hours temperature value and append to the object.
 * @param {string} nameOfCity Selected city name
 * @param {object} weatherData Object
 */
function appendNextFivehrs(nameOfCity, weatherData) {
  let interval;
  weatherData = fetchNextFivehrsForTheCity(nameOfCity, weatherData);
  clearInterval(interval);
  interval = setInterval(async () => {
    weatherData = fetchNextFivehrsForTheCity(nameOfCity, weatherData);
    return weatherData;
  }, 3600000);
  return weatherData;
}

/**
 * Fetch the weather data and replace the key value.
 * @params {} nothing
 * @return {object} weatherDetails
 */
async function fetchweatherDataAndUpdateKeyValue() {
  let liveDataOfCities;
  let weatherDetails;
  try {
    liveDataOfCities = await sendHttpRequestTofetchweatherData();
    weatherDetails = updateKeyValue(liveDataOfCities, "cityName");
  } catch (error) {
    console.log(error);
  }
  return weatherDetails;
}

/**
 * the function, which is used to call the functions, which are responsible for
 * fetch the live weather data.
 * @params {} nothing
 * @return {object} weatherDetails
 */
function getWeatherData() {
  let weatherDetails = fetchweatherDataAndUpdateKeyValue();
  setInterval(async () => {
    weatherDetails = fetchweatherDataAndUpdateKeyValue();
    return weatherDetails;
  }, 14400000);
  return weatherDetails;
}

export { getWeatherData, appendNextFivehrs };

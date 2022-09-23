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
    resolve(weatherData);
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
    resolve(cityName);
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
 * the function, which is used to call the functions, which are responsible for
 * fetch the live weather data.
 * @params {} nothing
 * @return {object} weatherDetails
 */
async function getWeatherData() {
  let liveDataOfCities;
  let nameOfCity;
  let cityName;
  let nextFiveHrs;
  let weatherDetails;

  let response = await fetchweatherData();
  try {
    if (response.ok) {
      liveDataOfCities = await response.json();
      for (let city of liveDataOfCities) {
        nameOfCity = city.cityName;
        let response_of_city = await fetchCityName(nameOfCity);
        cityName = await response_of_city.json();
        cityName.hours = 6;
        let response_of_nextFivehrs = await fetchNextFivehrs(cityName);
        nextFiveHrs = await response_of_nextFivehrs.json();
        city.nextFiveHrs = nextFiveHrs.temperature;
        weatherDetails = await updateKeyValue(liveDataOfCities, "cityName");
      }
    } else throw new Error("Something went wrong...");
  } catch (error) {
    console.log(error);
  }
  return weatherDetails;
}

export { getWeatherData };

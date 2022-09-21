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
  console.log(nameOfCity);
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
let nameOfCity;
let cityName;
let nextFiveHrs;

async function getWeatherData() {
  let response = await fetchweatherData();
  weatherData = await response.json();
  console.log("weatherData: ", weatherData);
  for (let city of weatherData) {
    nameOfCity = city.cityName;
    let response_of_city = await fetchCityName(nameOfCity);
    cityName = await response_of_city.json();
    cityName.hours = 6;
    console.log("cityName: ", cityName);
    let response_of_nextFivehrs = await fetchNextFivehrs(cityName);
    nextFiveHrs = await response_of_nextFivehrs.json();
    console.log("nextFiveHrs: ", nextFiveHrs);
  }
}
getWeatherData();

// fetchweatherData()
//   .then(
//     async (response) => {
//       weatherData = await response.json();
//       console.log("weatherData: ", weatherData);
//     },
//     (error) => console.log(error)
//   )
//   .then(() => {
//     for (let city of weatherData) {
//       nameOfCity = city.cityName;
//       fetchCityName(nameOfCity).then(
//         async (response) => {
//           cityName = await response.json();
//           cityName.hours = 6;
//           console.log("cityName: ", cityName);
//         },
//         (error) => console.log(error)
//       );
//     }
//   })
//   .then(() => {
//     console.log("2", cityName);
//     fetchNextFivehrs(cityName).then(async (response) => {
//       nextFiveHrs = await response.json();
//       console.log("nextFiveHrs: ", nextFiveHrs);
//     });
//   })

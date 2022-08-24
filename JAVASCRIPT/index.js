let cityname;
let cityname_list = [];

const cities = document.getElementById("browsers");
for (const city_weather in weather_data) {
  const options = document.createElement("OPTION");
  options.setAttribute("value", weather_data[city_weather].cityName);
  cities.appendChild(options);
  cityname_list.push(weather_data[city_weather].cityName.toLowerCase());
}


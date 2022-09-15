//Top section Javscript functions
import { weather_data } from "/DATA/data.js";

/** @type {Array,number} */
const at_present = "NOW";
const empty_value = "NIL";
let cityname_list = [];
let timeout;
document
  .getElementById("city_list")
  .addEventListener("change", updateDataOnCityname);
/* Import cityname from json to the datalist,
   Create a array of citynames.
   This is a self invoking function.
 */
(function () {
  const cities_list = document.getElementById("city_lists");
  for (let city in weather_data) {
    const options = document.createElement("OPTION");
    options.setAttribute("value", weather_data[city].cityName);
    cities_list.appendChild(options);
    cityname_list.push(weather_data[city].cityName.toLowerCase());
  }
})();

/**
 *
 * Validating the entered cityname is valid or not
 * return true if it is valid or return false.
 * @param {string} cityname name of the  selected city
 * @return {boolean} cityname is valid or not
 */
let checkCitynameIsValid = (cityname) => {
  if (cityname_list.includes(cityname)) return true;
  return false;
};
updateDataOnCityname();

/**
 *
 * Manipulates the image source based on the cityname
 * @param {string} cityname name of the  selected city
 * @return {void} nothing
 */
function updateIconImageSource(cityname, weathericon_idname) {
  const image_path = "./ASSETS/" + cityname + ".svg";
  if (weathericon_idname == "null") {
    updateUIElementAttributeWithTheGivenValue("icon", "src", image_path);
  } else {
    return image_path;
  }
}

/**
 *
 * To update the Live date of the selected city in the top section
 * By using date object and its predefined method live date is updated and citydate function is used to
 * append prefix as zero to the date.
 * @param {string} selected_city name of the  selected city
 * @param {reference} date_of_a_city Object reference
 * @return {string} city_date  live date of the city
 */
function updateDateBasedOnCity(
  selected_city,
  date_of_a_city,
  weathericon_idname
) {
  var date_time = new Date().toLocaleString("en-US", {
    timeZone: weather_data[selected_city].timeZone,
  });
  let date = new Date(date_time).getDate();
  let month = new Date(date_time).toLocaleString("en-US", {
    month: "short",
  });
  let year = new Date(date_time).getFullYear();

  let city_date = (function () {
    return date >= 1 && date <= 9
      ? `0${date}- ${month}- ${year}`
      : `${date}-${month}-${year}`;
  })();
  if (weathericon_idname == "null") {
    date_of_a_city[0].innerHTML = city_date;
  } else {
    return city_date;
  }
}

/**
 *
 * To update the Live time of the selected city in the top section
 * By using date object and its methods live date is fetched and  using hour value am or pm is decided.
 * if the second , minute , hour is less than 10 append zero to the beginning.
 * setinterval used to repeatedly call the display_live_time function
 * @param {string} selected_city name of the  selected city
 * @return {void} nothing
 */
function updateLiveTimeBasedOnTimezone(selected_city) {
  function display_Live_Time() {
    let date_time = new Date().toLocaleString("en-US", {
      timeZone: weather_data[selected_city].timeZone,
    });

    let part_of_time;
    var hour = new Date(date_time).getHours();
    var minute = new Date(date_time).getMinutes();
    var second = new Date(date_time).getSeconds();

    hour == 0
      ? ((hour = 12), (part_of_time = "AM"))
      : hour < 12
      ? (part_of_time = "AM")
      : hour == 12
      ? (part_of_time = "PM")
      : ((part_of_time = "PM"), (hour = hour - 12));
    if (second < 10)
      updateUIElementAttributeWithTheGivenValue(
        "time_in_seconds",
        "innerHTML",
        "0" + second
      );
    else
      updateUIElementAttributeWithTheGivenValue(
        "time_in_seconds",
        "innerHTML",
        second
      );

    if (minute < 10)
      updateUIElementAttributeWithTheGivenValue(
        "time_in_minutes",
        "innerHTML",
        "0" + minute + ": "
      );
    else
      updateUIElementAttributeWithTheGivenValue(
        "time_in_minutes",
        "innerHTML",
        minute + ": "
      );

    if (hour < 10)
      updateUIElementAttributeWithTheGivenValue(
        "time_in_hour",
        "innerHTML",
        "0" + hour + ": "
      );
    else
      updateUIElementAttributeWithTheGivenValue(
        "time_in_hour",
        "innerHTML",
        hour + ": "
      );

    part_of_time == "PM"
      ? updateUIElementAttributeWithTheGivenValue(
          "amimg",
          "src",
          "./ASSETS/pmState.svg"
        )
      : updateUIElementAttributeWithTheGivenValue(
          "amimg",
          "src",
          "./ASSETS/amState.png"
        );
    UpdateAmpmForNextfivehrs(hour, part_of_time);
  }
  clearInterval(timeout);
  timeout = setInterval(display_Live_Time, 1000);
}
/**
 *
 * Update the Temperature in celsius ,in farenheit and humidity ,precipitation for the selected city
 * Display the temperature values as per the format for the selected city
 * @param {string} cityname  name of the  selected city
 * @param {Array.<string>} temperature_celsius city temperature
 * @return {void} nothing
 */
function updateTemperature(cityname, temperature_celsius) {
  document.getElementById("temp-celsius").innerHTML =
    temperature_celsius[0] + " " + temperature_celsius[1];

  let temperature_farenheit = weather_data[cityname].temperature;
  temperature_farenheit = temperature_farenheit.split("°");
  temperature_farenheit[0] = ((temperature_farenheit[0] * 9) / 5 + 32).toFixed(
    1
  );
  document.getElementById("temp-farenheit").innerHTML =
    temperature_farenheit[0] + " F";

  let humidity_value = weather_data[cityname].humidity;
  document.getElementById("humidity_percentage").innerHTML =
    humidity_value.slice(0, humidity_value.length - 1) + " %";

  let precipitation_value = weather_data[cityname].precipitation;
  document.getElementById("precipitation_percentage").innerHTML =
    precipitation_value.slice(0, precipitation_value.length - 1) + " %";
}

/**
 *
 * Update the source of the weather images based the temperature and its condition
 * If the temperature value is between 23 and 29, update source with cloud image
 * If the temperature value is less than 18, update source with rainy image
 * If the temperature value is  between 23 and 29, update source with windy image
 * If the temperature value is greater than 29, update source with sunny image
 * @param {number} temp_after_every_hour temperature of the city for every one hour
 * @param {string} temp_icon id name of the image source
 * @return {void} nothing
 */
function updateImageSource(temp_after_every_hour, temp_icon) {
  if (temp_after_every_hour >= 23 && temp_after_every_hour <= 29)
    updateUIElementAttributeWithTheGivenValue(
      temp_icon,
      "src",
      "./ASSETS/cloudyIcon.svg"
    );
  else if (temp_after_every_hour < 18)
    updateUIElementAttributeWithTheGivenValue(
      temp_icon,
      "src",
      "./ASSETS/rainyIconBlack.svg"
    );
  else if (temp_after_every_hour >= 18 && temp_after_every_hour <= 22)
    updateUIElementAttributeWithTheGivenValue(
      temp_icon,
      "src",
      "./ASSETS/windyIcon.svg"
    );
  else if (temp_after_every_hour > 29)
    updateUIElementAttributeWithTheGivenValue(
      temp_icon,
      "src",
      "./ASSETS/sunnyIconBlack.svg"
    );
}

/**
 *
 * Update the temperature in celsius for the next five hours from the current time for the
 * selected city
 * Using for loop , time is incremented by 1 and temperature value is fetched from the object for the selected city
 * and by using object reference , the value is assigned.
 * @param {string} cityname name of the selected city
 * @return {void} nothing
 */
function fetchAndUpdateTemperatureForNextfivehrs(cityname) {
  let temp_list = weather_data[cityname].nextFiveHrs;
  for (var count = 1; count <= 5; count++) {
    let celsius_temperature = `temp-after-${count}hour`;
    let temp_icon = `icon_based_tempafter-${count}hour`;

    let temp_after_every_hour = temp_list[count - 1].slice(
      0,
      temp_list[count - 1].length - 2
    );
    updateUIElementAttributeWithTheGivenValue(
      celsius_temperature,
      "innerHTML",
      temp_after_every_hour
    );
    updateImageSource(temp_after_every_hour, temp_icon);
  }
}

/**
 *
 * Update the UI with Nil and warning image ,the element id,
 * element attribute and its value is taken as parameter.
 * @param {string} UIElementID  ID name of the element
 * @param {string} UIAttribute  Atrribute need to be change
 * @param {string} value_To_Update value to change
 */
function updateUIElementAttributeWithTheGivenValue(
  UIElementID,
  UIAttribute,
  value_To_Update
) {
  if (UIAttribute == "src") 
    document.getElementById(UIElementID).src = value_To_Update;
  else if (UIAttribute == "innerHTML") 
    document.getElementById(UIElementID).innerHTML = value_To_Update;
  else if(UIAttribute=='value')
    document.getElementById(UIElementID).value=value_To_Update;
  else if(UIAttribute=='borderBottom')
    document.getElementById(UIElementID).style.borderBottom=value_To_Update;
  else if(UIAttribute=='paddingBottom')
    document.getElementById(UIElementID).style.paddingBottom=value_To_Update;
  else if(UIAttribute=='display')
  document.getElementById(UIElementID).style.display=value_To_Update;
  else if(UIAttribute=='max')
  document.getElementById(UIElementID).max=value_To_Update;

}
/**
 *
 * validate the cityname , if not it will display Nil and warning image.
 * By fetching the id and by using the object reference , Nil value is assigned.
 * Warning image replaces with the all image sources.
 * @param {reference} date_of_a_city Object reference
 * @return {void} nothing
 */
function updateUIWithNil(date_of_a_city) {
  clearInterval(timeout);
  updateUIElementAttributeWithTheGivenValue(
    "icon",
    "src",
    "./ASSETS/warning.svg"
  );
  date_of_a_city[0].innerHTML = empty_value;
  updateUIElementAttributeWithTheGivenValue("time_in_seconds", "innerHTML", "");
  updateUIElementAttributeWithTheGivenValue("time_in_minutes", "innerHTML", "");
  updateUIElementAttributeWithTheGivenValue(
    "time_in_hour",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "amimg",
    "src",
    "./ASSETS/warning.svg"
  );
  updateUIElementAttributeWithTheGivenValue(
    "temp-celsius",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "temp-farenheit",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "humidity_percentage",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "precipitation_percentage",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "present_temperature",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "present_time",
    "innerHTML",
    empty_value
  );
  updateUIElementAttributeWithTheGivenValue(
    "icon_based_present_temp",
    "src",
    "./ASSETS/warning.svg"
  );
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    updateUIElementAttributeWithTheGivenValue(
      id_name,
      "innerHTML",
      empty_value
    );
  }
  for (var count = 1; count <= 5; count++) {
    let celsius_temperature = `temp-after-${count}hour`;
    let temp_icon = `icon_based_tempafter-${count}hour`;
    updateUIElementAttributeWithTheGivenValue(
      celsius_temperature,
      "innerHTML",
      empty_value
    );
    updateUIElementAttributeWithTheGivenValue(
      temp_icon,
      "src",
      "./ASSETS/warning.svg"
    );
  }
  alert('Invalid Cityname!, Please enter a valid cityname.')
}

/**
 *
 * event listener function to update data for the city.
 * A closure function is used check the entered city name is valid or not.
 * If valid the function will call all other functions to update live date, live time,
 * city icon, temperature, humitidy, precipitation, temperature for next five hours from current time and weather
 * icons according to the temperature value.
 * If it is invalid the invalid_Cityname function is called to display Nil value
 * @params {} nothing
 * @return {Function}function to update all data for the selected city and for invalid cityname.
 */
function updateDataOnCityname() {
  let selected_city = document.getElementById("city_list").value.toLowerCase();
  const date_of_a_city = document.getElementsByClassName("date-style");
  return (function () {
    if (checkCitynameIsValid(selected_city)) {
      let temperature_celsius = weather_data[selected_city].temperature;
      temperature_celsius = temperature_celsius.split("°");

      updateIconImageSource(selected_city,'null');
      updateDateBasedOnCity(selected_city, date_of_a_city, "null");
      updateTemperature(selected_city, temperature_celsius);

      document.getElementById("present_time").innerHTML = at_present;
      updateUIElementAttributeWithTheGivenValue(
        "present_temperature",
        "innerHTML",
        temperature_celsius[0]
      );
      updateImageSource(temperature_celsius[0], "icon_based_present_temp");
      fetchAndUpdateTemperatureForNextfivehrs(selected_city);
      updateLiveTimeBasedOnTimezone(selected_city, "null");
    } else {
      updateUIWithNil(date_of_a_city);
    }
  })();
}

/**
 *
 * Update source of the weather images based on the temperature
 * By using for loop, am ,pm value for the time is updated
 * @param {number} hour
 * @param {string} part_of_time
 * @return {void} nothing
 */
function UpdateAmpmForNextfivehrs(hour, part_of_time) {
  let time_iterator = hour;
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    time_iterator++;
    var time_value = time_iterator;

    time_value == 12 && part_of_time == "PM"
      ? (part_of_time = "AM")
      : time_value == 12 && part_of_time == "AM"
      ? (part_of_time = "PM")
      : time_value > 12 && part_of_time == "PM"
      ? ((time_value = time_value - 12), (part_of_time = "PM"))
      : time_value > 12 && part_of_time == "AM"
      ? ((time_value = time_value - 12), (part_of_time = "AM"))
      : time_value < 12 && part_of_time == "PM"
      ? (part_of_time = "PM")
      : (part_of_time = "AM");

    document.getElementById(id_name).innerHTML =
      time_value + " " + part_of_time;
  }
}

// middle section javascript
/* A variable to keep on update with the value of number of cities */

var spinner = 4;

/* Filter the data based on the condition and forms new list */
var sunny_list = Object.values(weather_data).filter(
  (value) =>
    parseInt(value.temperature) > 29 &&
    parseInt(value.humidity) < 50 &&
    parseInt(value.precipitation) >= 50
);

var snow_list = Object.values(weather_data).filter(
  (value) =>
    parseInt(value.temperature) >= 20 &&
    parseInt(value.temperature) <= 28 &&
    parseInt(value.humidity) > 50 &&
    parseInt(value.precipitation) < 50
);

var rainy_list = Object.values(weather_data).filter(
  (value) => parseInt(value.temperature) < 20 && parseInt(value.humidity) >= 50
);
/**
 * The function which is used to sort the three array based on the particular 
 * category.
 * 1.Sort Sunny list based on temperature.
 * 2.Sort Snow list based on precipitation.
 * 3.Sort Rainy list based on humidity. 
 * @params {}
 * @return {void} nothing
 */
function sortTheArrayBasedOnParticularCategory(array_list,weather_condition)
{
/** Sort the sunny list data based on temperature */ 
array_list.sort((a, b) =>
  parseInt(a[weather_condition]) < parseInt(b[weather_condition]) ? 1 : -1
);
};
sortTheArrayBasedOnParticularCategory(sunny_list,"temperature");
sortTheArrayBasedOnParticularCategory(snow_list,"precipitation");
sortTheArrayBasedOnParticularCategory(rainy_list,"humidity");


// card container's object reference
const card_container = document.getElementById("city-card");

/*objects to populate value when the weather icon is clicked*/
card_container.replaceChildren();
var weathericon_idname = "sunny-icon";
var list_of_city = [...sunny_list];
var icon_image = "./ASSETS/sunnyIcon.svg";

var sunny_data_list = {
  weathericon_idname: "sunny-icon",
  list_of_city: sunny_list,
  icon_image: "./ASSETS/sunnyIcon.svg",
};
var snow_data_list = {
  weathericon_idname: "snow-icon",
  list_of_city: snow_list,
  icon_image: "./ASSETS/snowflakeIcon.svg",
};
var rainy_data_list = {
  weathericon_idname: "rainy-icon",
  list_of_city: rainy_list,
  icon_image: "./ASSETS/rainyIcon.svg",
};


/**
 *
 * The function will create elements and populate the city name,temperature value to it and append  
 * it to the card.
 * @param {object reference} card_division Object reference of the card division
 * @param {string} cityname name of the city
 * @param {string} icon_image_path weather Icon image source  
 * @param {string} temperature_celsius temperature value of a city
 */
function updateCitynameAndTemperatureInTheCard(card_division,cityname,icon_image_path,temperature_celsius)
{
  let city_content_division = document.createElement("div");
  let name_of_city = document.createElement("p");
  let icon_temp_division = document.createElement("div");
  let weather_icon = document.createElement("img");
  let temperature_in_celsius = document.createElement("span");
  card_division.setAttribute("class", "card");
  city_content_division.setAttribute("class", "continent-content");
  name_of_city.setAttribute("class", "city-name");
  name_of_city.innerHTML = cityname;
  icon_temp_division.setAttribute("class", "temp-cardstyle");
  weather_icon.src = icon_image_path;
  weather_icon.style.width = "25px";
  temperature_in_celsius.setAttribute("class", "card-temp");
  temperature_in_celsius.innerHTML = temperature_celsius;
  card_container.appendChild(card_division);
  card_division.appendChild(city_content_division);
  city_content_division.appendChild(name_of_city);
  city_content_division.appendChild(icon_temp_division);
  icon_temp_division.appendChild(weather_icon);
  icon_temp_division.appendChild(temperature_in_celsius);
}


/**
 *
 * The function will create elements and populate the live date and time to it and append  
 * it to the card.
 * @param {object reference} card_division
 * @param {string} live_date_of_city
 * @param {string} cityname
 */
function updateDateAndTimeInTheCard(card_division,live_date_of_city,cityname)
{
  let time = document.createElement("p");
  let date = document.createElement("p");
  date.setAttribute("class", "card-date-time");
  date.innerHTML = live_date_of_city;
  time.setAttribute("class", "card-date-time");
  setInterval(
    displayLiveTimeToTheCity,
    10,
    cityname.toLowerCase(),
    time
  );
  card_division.appendChild(time);
  card_division.appendChild(date);
}


/**
 *
 * Whenever this function is invoked, it will set the background image as the City icon and 
 * add styles to it.
 * @param {object reference} card_division
 * @param {string} city_image
 */
function updateCityIconInTheCard(card_division,city_image)
{
  card_division.style.backgroundImage = "url(" + city_image + ")";
  card_division.style.backgroundRepeat = "no-repeat";
  card_division.style.backgroundPosition = "bottom right";
  card_division.style.backgroundSize = "65%";
}


/**
 * The function will create elements and populate the humidity and precipitation to it and append  
 * it to the card.
 * @param {object reference} card_division
 * @param {string} humidity_icon_img_path
 * @param {string} humidity_value
 * @param {string} precipitation_icon_img_path
 * @param {string} precipitation_value
 */
function updateHumidityAndPrecipitationInTheCard(card_division,humidity_icon_img_path,humidity_value,precipitation_icon_img_path,precipitation_value)
{
  let humidity_division = document.createElement("div");
  let precipitation_division = document.createElement("div");
  let humidity_icon = document.createElement("img");
  let humidity_in_percentage = document.createElement("span");
  let precipitation_icon = document.createElement("img");
  let precipitation_in_percentage = document.createElement("span");
  humidity_icon.src = humidity_icon_img_path;
  humidity_icon.style.width = "16px";
  humidity_in_percentage.innerHTML = humidity_value;
  humidity_in_percentage.setAttribute("class", "rainy-temp");
  precipitation_icon.src = precipitation_icon_img_path;
  precipitation_icon.style.width = "16px";
  precipitation_in_percentage.innerHTML = precipitation_value;
  precipitation_in_percentage.setAttribute("class", "rainy-temp");
  card_division.appendChild(humidity_division);
  card_division.appendChild(precipitation_division);
  humidity_division.appendChild(humidity_icon);
  humidity_division.appendChild(humidity_in_percentage);
  precipitation_division.appendChild(precipitation_icon);
  precipitation_division.appendChild(precipitation_in_percentage);
}
/**
 *
 * whenever The function is invoked , it will create card and 
 * populate the given values with respect to the weather icon selected.
 * All styles are added to the element 
 * @param {string} cityname name of the city
 * @param {string} icon_image_path weather icon image source
 * @param {string} temperature_celsius  temperature value in celsius for the city
 * @param {string} live_date_of_city    live date of the city
 * @param {string} humidity_icon_img_path  humidity icon image source
 * @param {string} humidity_value humidity value in percentage
 * @param {string} precipitation_icon_img_path  precipitation icon image source
 * @param {string} precipitation_value precipitation value in percentage
 * @param {string} city_image city image source
 * @return {void} nothing
 */
function createCardAndUpdateDataWithTheGivenValue(
  cityname,
  icon_image_path,
  temperature_celsius,
  live_date_of_city,
  humidity_icon_img_path,
  humidity_value,
  precipitation_icon_img_path,
  precipitation_value,
  city_image
) {
  let card_division = document.createElement("div");
  updateCitynameAndTemperatureInTheCard(card_division,cityname,icon_image_path,temperature_celsius);
  updateDateAndTimeInTheCard(card_division,live_date_of_city,cityname);
  updateCityIconInTheCard(card_division,city_image);
  updateHumidityAndPrecipitationInTheCard(card_division,humidity_icon_img_path,humidity_value,precipitation_icon_img_path,precipitation_value);
}


/**
 *
 * whenever the Icon is selected , there will be appearing of blue line under the Icon.
 * From DOM event listener the idname of the weather icon is passed to this function based on that, 
 * it functions
 * @param {string} weathericon_idname Id name of the weather icon ,it is used to change values
 * @return {void} nothing
 */
function selectTheIconWhichIsClicked(weathericon_idname) {
  if (weathericon_idname == "sunny-icon") {
    updateUIElementAttributeWithTheGivenValue('sun-image','borderBottom','2px solid skyblue');
    updateUIElementAttributeWithTheGivenValue('snow-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('rainy-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('sun-image','paddingBottom','3px');
  } else if (weathericon_idname == "snow-icon") {
    updateUIElementAttributeWithTheGivenValue('snow-image','borderBottom','2px solid skyblue');
    updateUIElementAttributeWithTheGivenValue('sun-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('rainy-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('snow-image','paddingBottom','3px');
  } else if (weathericon_idname == "rainy-icon") {
    updateUIElementAttributeWithTheGivenValue('rainy-image','borderBottom','2px solid skyblue');
    updateUIElementAttributeWithTheGivenValue('sun-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('snow-image','borderBottom',0);
    updateUIElementAttributeWithTheGivenValue('rainy-image','paddingBottom','3px');
  }
}

 /**
  *
  * The function will set the value of the spinner based on the condition provided for
  * the particular weather.
  * @param {Array} weather_list array of objects
  * @param {number} no_of_cities_to_display number of city to display in the UI
  * @return {number} no_of_cities_to_display -number of city to display in the UI
  */
 function updateSpinnerValueBasedOnTheGivenCondition(weather_list,no_of_cities_to_display)
{
  let length_of_list = weather_list.length;
  if (length_of_list < no_of_cities_to_display) {
    no_of_cities_to_display = length_of_list;
  }
  if(length_of_list<=3)
  {
    spinner=3;
    updateUIElementAttributeWithTheGivenValue('numberofcities','max',3);
    updateUIElementAttributeWithTheGivenValue('numberofcities','value',3);
  }
  else
  {
    updateUIElementAttributeWithTheGivenValue('numberofcities','max',10);
  }
  return no_of_cities_to_display;
}
/**
 *
 * This function will decides, how many card to display on UI and 
 * create the card and populate data and display it in UI based on the selected Weather Icon
 * @param {string} weathericon_idname Id name of the weather icon ,it is used to change values
 * @param {Array} weather_list Array list to display data to the UI 
 * @param {string} weathericon_img_path weather icon image source
 * @param {number} no_of_cities_to_display count of the city to display in UI
 * @return {void} nothing
 */
function createCardToTheSelectedCityAndPopulateCityDetails(
  weathericon_idname,
  weather_list,
  weathericon_img_path,
  no_of_cities_to_display
) {
  no_of_cities_to_display=updateSpinnerValueBasedOnTheGivenCondition(weather_list,no_of_cities_to_display);
  let count = 0;
  for (let city of weather_list) {
    if (count < no_of_cities_to_display) {
      
      let live_date_of_city = updateDateBasedOnCity(
        city.cityName.toLowerCase(),
        "null",
        weathericon_idname
      );
      let city_image = updateIconImageSource(
        city.cityName,
        weathericon_idname
      );
      createCardAndUpdateDataWithTheGivenValue(
        city.cityName,
        weathericon_img_path,
        city.temperature,
        live_date_of_city,
        "./ASSETS/humidityIcon.svg",
        city.humidity,
        "./ASSETS/precipitationIcon.svg",
        city.precipitation,
        city_image
      );
      hideTheScrollArrow();
      count++;
    }
  }
}


/**
 *
 * To update the Live time of the city in the card.
 * By using date object and its methods live date is fetched and  using hour value am or pm is decided.
 * setinterval used to repeatedly call the display_live_time function
 * @param {string} nameOfThe_city name of the city 
 * @param {object reference} time object reference
 */
function displayLiveTimeToTheCity(nameOfThe_city, time) {
  let date_time = new Date().toLocaleString("en-US", {
    timeZone: weather_data[nameOfThe_city].timeZone,
  });

  let part_of_time;
  var hour = new Date(date_time).getHours();
  var minute = new Date(date_time).getMinutes();
  var second = new Date(date_time).getSeconds();

  hour == 0
    ? ((hour = 12), (part_of_time = "AM"))
    : hour < 12
    ? (part_of_time = "AM")
    : hour == 12
    ? (part_of_time = "PM")
    : ((part_of_time = "PM"), (hour = hour - 12));

  (hour < 10) ? (hour = "0" + hour + ": "): (hour = hour + ": ");
  (minute < 10)? (minute = "0" + minute): (minute = minute);

  date_time = hour + minute + " " + part_of_time;
  time.innerHTML = date_time;
}


/**
 * While changing the values in spinner,createCardToTheSelectedCityAndPopulateCityDetails function will
 * be called , which will create card and populate values in it. 
 * Based on the value in spinner , the cards will display
 * @params {}
 * @return {void}
 */
function noOfCitiesToDisplayInUI() {
  let display_no_of_city = document.getElementById("numberofcities");
  spinner = display_no_of_city.value;
  if (spinner > 10) {
    spinner = 10;
  }
  card_container.replaceChildren();
  createCardToTheSelectedCityAndPopulateCityDetails(
    weathericon_idname,
    list_of_city,
    icon_image,
    spinner
  );
}


/**
 * whenever the particular Icon is clicked, this function is invoked. 
 * this further calls two functions , it select the weather icon and create cards and populate details. 
 *@params {}
 * @return {function} 
 */
function updateContainerWithCitiesInformationBasedOnWeatherIconSelected() {
  return (function () {
    selectTheIconWhichIsClicked(weathericon_idname);
    card_container.replaceChildren();
    createCardToTheSelectedCityAndPopulateCityDetails(
      weathericon_idname,
      list_of_city,
      icon_image,
      spinner
    );
  })();
}


/**
 * It is used to populate the Idname, arraylist , Image source to the variable
 * based on the weather icon selected
 * @params {}
 * @return {void}
 */
function populateDetailsBasedOnIconSelected() {
  weathericon_idname = this.weathericon_idname;
  list_of_city = this.list_of_city;
  icon_image = this.icon_image;
}

document.getElementById("sunny-icon").addEventListener("click", () => {
  populateDetailsBasedOnIconSelected.call(sunny_data_list);
  updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
});

document.getElementById("snow-icon").addEventListener("click", () => {
  populateDetailsBasedOnIconSelected.call(snow_data_list);
  updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
});

document.getElementById("rainy-icon").addEventListener("click", () => {
  populateDetailsBasedOnIconSelected.call(rainy_data_list);
  updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
});

document
  .getElementById("numberofcities")
  .addEventListener("change", noOfCitiesToDisplayInUI);
createCardToTheSelectedCityAndPopulateCityDetails(
  weathericon_idname,
  list_of_city,
  icon_image,
  spinner
);


document.getElementById("left-scroll").addEventListener("click", () => {
  setTimeout(() => (card_container.scrollLeft -= 530), 200);
});
document.getElementById("right-scroll").addEventListener("click", () => {
  setTimeout(() => (card_container.scrollLeft += 530), 200);
});

document
  .getElementById("numberofcities")
  .addEventListener("input", validateTheSpinner);


/**
 * It allows only the value between 3 and 10 , it restricts
 * If it exceeds 10, it automatically changes to 10
 * If it is less 3 , it automatically changes to 3
 * @params {}
 * @return {void}
 */
 
function validateTheSpinner() {
  parseInt(this.value) < 3
    ? (updateUIElementAttributeWithTheGivenValue('numberofcities','value',3))
    : parseInt(this.value) > 10
    ? (updateUIElementAttributeWithTheGivenValue('numberofcities','value',10))
    : (updateUIElementAttributeWithTheGivenValue('numberofcities','value',parseInt(this.value)));
}


/**
 * It will hide the carousel button , when the card is less than or equal to 4.
 * It displays the button, when it card exceeds 4 and as well the screen size is small
 *@params {}
 *@return {void}
 */
function hideTheScrollArrow() {
  let length_of_container = card_container.clientWidth;
  let length_of_Whole_city = card_container.scrollWidth;
  let carousel_division=document.getElementsByClassName('carousel-div');
  if (length_of_Whole_city <= length_of_container) {
    carousel_division[0].style.display='none';
    carousel_division[1].style.display='none';
    updateUIElementAttributeWithTheGivenValue('left-scroll','display',"none");
    updateUIElementAttributeWithTheGivenValue('right-scroll','display',"none");
  } else {
    carousel_division[0].style.display='flex';
    carousel_division[1].style.display='flex';
    updateUIElementAttributeWithTheGivenValue('left-scroll','display',"flex");
    updateUIElementAttributeWithTheGivenValue('right-scroll','display',"flex");
  }
}
setInterval(hideTheScrollArrow,1000);

// bottom section 
/**
 * Tile container object reference
 * Weather details is an array, that contains the city weather information 
 */ 
 var tile_container=document.getElementById('continent-wise-list');
 tile_container.replaceChildren()
 var weather_details=Object.values(weather_data);
 

 /**
  * This will sort the array in ascending order based on the Continent name.  
  *@params {}
  *@return {void} nothing
  */
  let ContinentAscendList=()=>(weather_details.sort((a, b) => a.timeZone.split('/')[0]>b.timeZone.split('/')[0]?1:-1));
 
 /**
  * This will sort the array in descending order based on the Continent name.  
  *@params {}
  *@return {void} nothing
  */
  let ContinentDescendList=()=>(weather_details.sort((a, b) => a.timeZone.split('/')[0]<b.timeZone.split('/')[0]?1:-1));

 
 /**
  *
  * The funtion will create elements and populate continent name and temperature to the tile.
  * @param {object reference} tile_content_division Object reference of the tile division
  * @param {string} timezone Timezone of the city
  * @param {string} temperature_celsius temperature of the city
  */
 function  updateContinentnameAndTemperatureInTheTile(tile_content_division,timezone,temperature_celsius)
 {
  let continent_name=document.createElement('p');
  let temperature_of_continent=document.createElement('p');
  tile_container.setAttribute('class','cities-with-temp-info');
  tile_content_division.setAttribute('class','tile-content');
  continent_name.setAttribute('class','continent-name');
  continent_name.innerHTML=timezone.split('/')[0];
  temperature_of_continent.setAttribute('class',"continent-temp");
  temperature_of_continent.innerHTML=temperature_celsius;
  tile_container.appendChild(tile_content_division);
  tile_content_division.appendChild(continent_name);
  tile_content_division.appendChild(temperature_of_continent);
 }


 /**
  *
  * The function will create elements and populate state name and live time to the tile.
  * @param {object reference} tile_content_division  Object reference of the tile division
  * @param {string} cityname name of the city
  */
 function updateStatenameAndTimeInTheTile(tile_content_division,cityname)
 {
  let state_name=document.createElement('p');
  let live_time=document.createElement('span');
  state_name.setAttribute('class','state-name');
  state_name.innerHTML=cityname+',';
  setInterval(displayLiveTimeToTheCity,10,cityname.toLowerCase(),live_time);
  tile_content_division.appendChild(state_name);
  state_name.appendChild(live_time);
 }


 /**
  *
  * The function will create elements and populate humidity value to the tile.
  * @param {object reference} tile_content_division  Object reference of the tile division
  * @param {string} humidity_value humidity of the city
  */
 function updateHumidityInTheTile(tile_content_division,humidity_value)
 {
  let humidity_division=document.createElement('p');
  let humidity_icon=document.createElement('img');
  let humidity_in_percentage=document.createElement('span');
  humidity_division.setAttribute('class', 'humidity-representation');
  humidity_icon.src="./ASSETS/humidityIcon.svg";
  humidity_icon.setAttribute('id','humidity-img');
  humidity_in_percentage.setAttribute('class','humidity-per');
  humidity_in_percentage.innerHTML=humidity_value;
  tile_content_division.appendChild(humidity_division);
  humidity_division.appendChild(humidity_icon);
  humidity_division.appendChild(humidity_in_percentage);
 }

 /**
  * This will create the elements for the tile and set style attributes and 
  * populate the given values to it
  * @param {string} cityname name of the city
  * @param {string} timezone timezone of the city
  * @param {string} temperature_celsius temperature in celsius format of the city
  * @param {string} humidity_value humidity in percentage of the city
  */
 function createTileAndPopulateCityDetails(cityname,timezone,temperature_celsius,humidity_value)
 {
 
 let tile_content_division=document.createElement('div');
 updateContinentnameAndTemperatureInTheTile(tile_content_division,timezone,temperature_celsius);
 updateStatenameAndTimeInTheTile(tile_content_division,cityname);
 updateHumidityInTheTile(tile_content_division,humidity_value);
 }

 /**
  * Whenever the page is loaded,the DOM event triggers and calls
  * createTileOnLoad function to create tiles with continent details. 
  */
 document.getElementById('continent-wise-list').onload=createTileOnLoad();
 
 /**
  * The function is called whenever the page loads.
  * @params{}
  * @return{void} nothing
  */
 function createTileOnLoad()
 {
   ContinentDescendList();
   createTile(weather_details);
 }
 
 /**
  * Whenever the arrow is clicked, the dom event triggers and calls the function.
  */
 document.getElementById('sort-by-continent').addEventListener('click',()=>
 {
   updateTheArrowImageAndContinentOrder();
 })
 document.getElementById('sort-by-temperature').addEventListener('click',()=>
 {
   upadteTheArrowImageAndtemperatureOrder();
 })
 
 /**
  * Update the image source of the arrow and name attribute,
  * sort the array list based on the continent name, 
  * decides ascending or descending based on the name attribute of the arrow image. 
  * @params {}
  * @return {void} nothing
  */
 function updateTheArrowImageAndContinentOrder()
 {
   let continent_arrow=document.getElementById('sort-by-continent');
  if(continent_arrow.name=='continent-arrow-down')
  {
   ContinentAscendList();
   createTile(weather_details);
   continent_arrow.name='continent-arrow-up';
   updateUIElementAttributeWithTheGivenValue('sort-by-continent','src','/ASSETS/arrowUp.svg');
  }
  else
  {
   ContinentDescendList();
   createTile(weather_details);
   continent_arrow.name='continent-arrow-down';
   updateUIElementAttributeWithTheGivenValue('sort-by-continent','src','/ASSETS/arrowDown.svg');
  }
 }
 
 /**
  * Update the image source of the arrow and name attribute,
  * sort the array list based on the temperature, 
  * decides ascending or descending based on the name attribute of the arrow image. 
  * @params {}
  * @return {void} nothing
  */
 function upadteTheArrowImageAndtemperatureOrder()
 {
  let temperature_arrow=document.getElementById('sort-by-temperature');
  if(temperature_arrow.name=='temperature-arrow-up')
  {
   sortArrayInDescendingOrderBasedOnTemperature();
   createTile(weather_details);
   temperature_arrow.name='temperature-arrow-down';
   updateUIElementAttributeWithTheGivenValue('sort-by-temperature','src','/ASSETS/arrowDown.svg');
  }
  else
  {
   sortArrayInAscendingOrderBasedOnTemperature();
   createTile(weather_details);
   temperature_arrow.name='temperature-arrow-up';
   updateUIElementAttributeWithTheGivenValue('sort-by-temperature','src','/ASSETS/arrowUp.svg');
  }
 }
 
 /**
  * Create a tile and populate the continent details to the tile container
  * @param {array} Weather_list 
  * @return {void} nothing
  */
 function createTile(Weather_list)
 {
 tile_container.replaceChildren()  
 let count=1;
 for(let city of Weather_list)  
 {
 if(count<=12)
 {
 createTileAndPopulateCityDetails(city.cityName,city.timeZone,city.temperature,city.humidity);
 count++;
 }
 }
 }
 
 /**
  * Sort the array in the ascending order based on the temperature.
  * @params {}
  * @return {void} nothing
  */
 function sortArrayInAscendingOrderBasedOnTemperature()
 {
   weather_details.sort((a,b)=>{
    if(a.timeZone.split('/')[0]===b.timeZone.split('/')[0])
      return parseInt(a.temperature) > parseInt(b.temperature)?1:-1;
   });
 }
 
 /**
  * Sort the array in the Descending order based on the temperature.
  * @params {}
  * @return {void} nothing
  */
 function sortArrayInDescendingOrderBasedOnTemperature()
 {
  weather_details.sort((a,b)=>{
    if(a.timeZone.split('/')[0]===b.timeZone.split('/')[0])
      return parseInt(a.temperature) < parseInt(b.temperature)?1:-1;
   });
 }
 
 
 

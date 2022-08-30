//Top section Javscript functions
import { weather_data } from "/DATA/data.js";

/** @type {Array,number} */
const at_present = "NOW";
const empty_value = "NIL";
let cityname_list = [];
let timeout;
document
  .getElementById("city_list")
  .addEventListener("change", update_Data_On_Cityname);
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
let check_Cityname_Is_Valid = (cityname) => {
  for (let name of cityname_list) {
    if (cityname == name) {
      return true;
    }
  }
  return false;
};
update_Data_On_Cityname();

/**
 *
 * Manipulates the image source based on the cityname
 * @param {string} cityname name of the  selected city
 * @return {void} nothing
 */
function update_Icon_Image_Source(cityname) {
  const image_path = "./ASSETS/" + cityname + ".svg";
  updateUIElementAttributeWithTheGivenValue("icon", "src", image_path);
}

/**
 *
 * To update the Live date of the selected city in the top section
 * By using date object and its predefined method live date is updated and citydate function is used to
 * append prefix as zero to the date.
 * @param {string} selected_city name of the  selected city
 * @param {reference} date_of_a_city Object reference
 * @return {void} nothing
 */
function update_Date_Based_On_City(selected_city, date_of_a_city) {
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
  date_of_a_city[0].innerHTML = city_date;
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
function update_live_time_based_on_timezone(selected_city) {
  function display_Live_Time() {
    let date_time = new Date().toLocaleString("en-US", {
      timeZone: weather_data[selected_city].timeZone,
    });

    let part_Of_Time;
    var hour = new Date(date_time).getHours();
    var minute = new Date(date_time).getMinutes();
    var second = new Date(date_time).getSeconds();

    hour == 0
      ? ((hour = 12), (part_Of_Time = "AM"))
      : hour < 12
      ? (part_Of_Time = "AM")
      : hour == 12
      ? (part_Of_Time = "PM")
      : ((part_Of_Time = "PM"), (hour = hour - 12));

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

    part_Of_Time == "PM"
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

    Update_ampm_For_Nextfivehrs(hour, part_Of_Time);
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
function update_Temperature(cityname, temperature_celsius) {
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
function update_Image_Source(temp_after_every_hour, temp_icon) {
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
function fetch_And_Update_Temperature_For_Nextfivehrs(cityname) {
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
    update_Image_Source(temp_after_every_hour, temp_icon);
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
}
/**
 *
 * validate the cityname , if not it will display Nil and warning image.
 * By fetching the id and by using the object reference , Nil value is assigned.
 * Warning image replaces with the all image sources.
 * @param {reference} date_of_a_city Object reference
 * @return {void} nothing
 */
function update_UI_With_Nil(date_of_a_city) {
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
}

/**
 *
 * event listener function to update data for the city.
 * A closure function is used check the entered city name is valid or not.
 * If valid the function will call all other functions to update live date, live time,
 * city icon, temperature, humitidy, precipitation, temperature for next five hours from current time and weather
 * icons according to the temperature value.
 * If it is invalid the invalid_Cityname function is called to display Nil value
 * @params {}
 * @return {Function}function to update all data for the selected city and for invalid cityname.
 */
function update_Data_On_Cityname() {
  let selected_city = document.getElementById("city_list").value.toLowerCase();
  const date_of_a_city = document.getElementsByClassName("date-style");
  return (function () {
    if (check_Cityname_Is_Valid(selected_city)) {
      let temperature_celsius = weather_data[selected_city].temperature;
      temperature_celsius = temperature_celsius.split("°");

      update_Icon_Image_Source(selected_city);
      update_Date_Based_On_City(selected_city, date_of_a_city);
      update_Temperature(selected_city, temperature_celsius);

      document.getElementById("present_time").innerHTML = at_present;
      updateUIElementAttributeWithTheGivenValue(
        "present_temperature",
        "innerHTML",
        temperature_celsius[0]
      );
      update_Image_Source(temperature_celsius[0], "icon_based_present_temp");
      fetch_And_Update_Temperature_For_Nextfivehrs(selected_city);
      update_live_time_based_on_timezone(selected_city);
    } else {
      update_UI_With_Nil(date_of_a_city);
    }
  })();
}

/**
 *
 * Update source of the weather images based on the temperature
 * By using for loop, am ,pm value for the time is updated
 * @param {number} hour
 * @param {string} part_Of_Time
 * @return {void} nothing
 */
function Update_ampm_For_Nextfivehrs(hour, part_Of_Time) {
  let time_iterator = hour;
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    time_iterator++;
    var time_value = time_iterator;

    time_value == 12 && part_Of_Time == "PM"
      ? (part_Of_Time = "AM")
      : time_value == 12 && part_Of_Time == "AM"
      ? (part_Of_Time = "PM")
      : time_value > 12 && part_Of_Time == "PM"
      ? ((time_value = time_value - 12), (part_Of_Time = "PM"))
      : time_value > 12 && part_Of_Time == "AM"
      ? ((time_value = time_value - 12), (part_Of_Time = "AM"))
      : time_value < 12 && part_Of_Time == "PM"
      ? (part_Of_Time = "PM")
      : (part_Of_Time = "AM");

    document.getElementById(id_name).innerHTML =
      time_value + " " + part_Of_Time;
  }
}

// middle section

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

sunny_list.sort((a, b) => (a.temperature < b.temperature ? 1 : -1));
snow_list.sort((a, b) => (a.precipitation < b.precipitation ? 1 : -1));
rainy_list.sort((a, b) => (a.humidity < b.humidity ? 1 : -1));

// console.log(sunny_list);
// console.log(snow_list);
// console.log(rainy_list);
const division = document.getElementById("City-card");
//division.removeChild(division.lastElementChild);
division.remove();
function create_card(Name)
{
  let container=document.getElementById('City-card');
  console.log(container);
  let card_division=document.createElement("div");
  let city_content_division=document.createElement('div');
  let name_of_city=document.createElement('p');
  name_of_city.value=Name;
  let icon_temp_division=document.createElement('div');
  let weather_icon=document.createElement('img');
  let temperature_in_celsius=document.createElement('span');
  let time=document.createElement('p');
  let date=document.createElement('p');
  let humidity_division=document.createElement('div');
  let precipitation_division=document.createElement('div');
  let humidity_icon=document.createElement('img');
  let humidity_in_percentage=document.createElement('span');
  let precipitation_icon=document.createElement('img');
  let precipitation_in_percentage=document.createElement('span');
  container.appendChild(card_division);
  card_division.appendChild(city_content_division);
  city_content_division.appendChild(name_of_city);
  city_content_division.appendChild(icon_temp_division);
  icon_temp_division.appendChild(weather_icon);
  icon_temp_division.appendChild(temperature_in_celsius);
  card_division.appendChild(time);
  card_division.appendChild(date);
  card_division.appendChild(humidity_division);
  card_division.appendChild(precipitation_division);
  humidity_division.appendChild(humidity_icon);
  humidity_division.appendChild(humidity_in_percentage);
  precipitation_division.appendChild(precipitation_icon);
  precipitation_division.appendChild(precipitation_in_percentage);
}
document.getElementById("Sunny-icon").addEventListener("click", function () {
  document.getElementById("sun-image").style.borderBottom = "2px solid skyblue";
  document.getElementById("sun-image").style.paddingBottom = "3px";
  document.getElementById("snow-image").style.borderBottom = 0;
  document.getElementById("rainy-image").style.borderBottom = 0;
  for(let city of sunny_list)
  {
   create_card(city.cityName);
   //console.log(city);
  }
});
document.getElementById("Snow-icon").addEventListener("click", function () {
  document.getElementById("snow-image").style.borderBottom =
    "2px solid skyblue";
  document.getElementById("snow-image").style.paddingBottom = "3px";
  document.getElementById("rainy-image").style.borderBottom = 0;
  document.getElementById("sun-image").style.borderBottom = 0;
});
document.getElementById("rainy-icon").addEventListener("click", function () {
  document.getElementById("rainy-image").style.borderBottom =
    "2px solid skyblue";
  document.getElementById("rainy-image").style.paddingBottom = "3px";
  document.getElementById("snow-image").style.borderBottom = 0;
  document.getElementById("sun-image").style.borderBottom = 0;
});

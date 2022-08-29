//top section
import {weather_data} from '/DATA/data.js'

/** @type {Array,number} */
let cityname_list = [];
let timeout;
document.getElementById('city_list').addEventListener("change",update_Data_On_Cityname);
/* Import cityname from json to the datalist,
   Create a array of citynames.
   This is a self invoking function.
 */
(function () {
  const cities_list = document.getElementById("city_lists");
  for (let city_weather in weather_data) {
    const options = document.createElement("OPTION");
    options.setAttribute("value", weather_data[city_weather].cityName);
    cities_list.appendChild(options);
    cityname_list.push(weather_data[city_weather].cityName.toLowerCase());
  }
})();

/**
 *
 * Validating the entered cityname is valid or not
 * @param {string} cityname name of the  selected city
 * @return {boolean} cityname is valid or not
 */
let check_Cityname = (cityname) => {
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
  document.getElementById("icon").src = image_path;
}


/**
 *
 * To update the Live date of the selected city in the top section
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
    return date >= 1 && date <= 9 ?`0${date}- ${month}- ${year}`:`${date}-${month}-${year}`;
  })();
  date_of_a_city[0].innerHTML = city_date;
}

/**
 *
 * Decides whether to display am or pm image.
 * @param {string} current_ampm  am or pm based on time
 * @return {void} nothing
 */
function ampm_Image_Update(current_ampm) {
  if (current_ampm == "PM")
    document.getElementById("amimg").src = "./ASSETS/pmState.svg";
  else document.getElementById("amimg").src = "./ASSETS/amState.png";
}

/**
 *
 * To update the Live time of the selected city in the top section
 * @param {string} selected_city name of the  selected city
 * @return {void} nothing
 */
function update_live_time_based_on_timezone(selected_city) {
  function display_Live_Time() {
    let date_time = new Date().toLocaleString("en-US", {
      timeZone: weather_data[selected_city].timeZone,
    });
   
    let current_ampm;
    var hour = new Date(date_time).getHours();
    var minute = new Date(date_time).getMinutes();
    var second = new Date(date_time).getSeconds();

    (hour==0)?(hour = 12,current_ampm = "AM"):(hour < 12)?current_ampm = "AM":(hour == 12)?current_ampm = "PM":(current_ampm = "PM",
    hour = hour - 12);

    if (second < 10)
      document.getElementById("time_in_seconds").innerHTML = "0" + second;
    else document.getElementById("time_in_seconds").innerHTML = second;

    if (minute < 10)
      document.getElementById("time_in_minutes").innerHTML =
        "0" + minute + ": ";
    else document.getElementById("time_in_minutes").innerHTML = minute + ": ";

    if (hour < 10)
      document.getElementById("time_in_hour").innerHTML = "0" + hour + ": ";
    else document.getElementById("time_in_hour").innerHTML = hour + ": ";

    ampm_Image_Update(current_ampm);
    ampm_Update_For_Nextfivehrs(hour, current_ampm);
  }
  clearInterval(timeout);
  timeout = setInterval(display_Live_Time, 1000);
}

/**
 *
 * Update the Temperature in celsius ,in farenheit and humidity ,precipitation for the selected city
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
 * @param {number} temp_after_every_hour temperature of the city for every one hour
 * @param {string} temp_icon id name of the image source
 * @return {void} nothing
 */
function update_Image_Source(temp_after_every_hour, temp_icon) {

  if (temp_after_every_hour >= 23 && temp_after_every_hour <= 29)
    document.getElementById(temp_icon).src = "./ASSETS/cloudyIcon.svg";
  else if (temp_after_every_hour < 18)
    document.getElementById(temp_icon).src = "./ASSETS/rainyIconBlack.svg";
  else if (temp_after_every_hour >= 18 && temp_after_every_hour <= 22)
    document.getElementById(temp_icon).src = "./ASSETS/windyIcon.svg";
  else if (temp_after_every_hour > 29)
    document.getElementById(temp_icon).src = "./ASSETS/sunnyIconBlack.svg";
}

/**
 *
 * Update the temperature in celsius for the next five years from the current time for the 
 * selected city
 * @param {string} cityname name of the selected city
 * @return {void} nothing
 */
function fetch_Temperature_For_Nextfivehrs(cityname) {
  let temp_list = weather_data[cityname].nextFiveHrs;
  for (var count = 1; count <= 5; count++) {
    let celsius_temperature = `temp-after-${count}hour`;
    let temp_icon = `icon_based_tempafter-${count}hour`;

    let temp_after_every_hour = temp_list[count - 1].slice(
      0,
      temp_list[count - 1].length - 2
    );
    document.getElementById(celsius_temperature).innerHTML =
      temp_after_every_hour;

    update_Image_Source(temp_after_every_hour, temp_icon);
  }
}

/**
 *
 * validate the cityname , if not it will display nil and warning image
 * @param {reference} date_of_a_city Object reference
 * @return {void} nothing
 */
function invalid_Cityname(date_of_a_city) {
  clearInterval(timeout);
  document.getElementById("icon").src = "./ASSETS/warning.svg";
  date_of_a_city[0].innerHTML = "NIL";
  document.getElementById("time_in_seconds").innerHTML = "";
  document.getElementById("time_in_minutes").innerHTML = "";
  document.getElementById("time_in_hour").innerHTML = "NIL";
  document.getElementById("amimg").src = "./ASSETS/warning.svg";
  document.getElementById("temp-celsius").innerHTML = "NIL";
  document.getElementById("temp-farenheit").innerHTML = "NIL";
  document.getElementById("humidity_percentage").innerHTML = "NIL";
  document.getElementById("precipitation_percentage").innerHTML = "NIL";
  document.getElementsByClassName("cloud-img").src = "./ASSETS/warning.svg";
  document.getElementById("present_temperature").innerHTML = "nil";
  document.getElementById("present_time").innerHTML = "nil";
  document.getElementById("icon_based_present_temp").src =
    "./ASSETS/warning.svg";
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    document.getElementById(id_name).innerHTML = "nil";
  }
  for (var count = 1; count <= 5; count++) {
    let celsius_temperature = `temp-after-${count}hour`;
    let temp_icon = `icon_based_tempafter-${count}hour`;
    document.getElementById(celsius_temperature).innerHTML = "nil";
    document.getElementById(temp_icon).src = "./ASSETS/warning.svg";
  }
}

/**
 *
 * event listener function to update data for the city
 * @params {}
 * @return {Function}function to update all data for the selected city and for invalid cityname.
 */
function update_Data_On_Cityname() {
  let selected_city = document.getElementById("city_list").value.toLowerCase();
  const date_of_a_city = document.getElementsByClassName("date-style");
  return (function () {
    if (check_Cityname(selected_city)) {
      let temperature_celsius = weather_data[selected_city].temperature;
      temperature_celsius = temperature_celsius.split("°");

      update_Icon_Image_Source(selected_city);
      update_Date_Based_On_City(selected_city, date_of_a_city);
      update_Temperature(selected_city, temperature_celsius);

      document.getElementById("present_time").innerHTML = "NOW";
      document.getElementById("present_temperature").innerHTML =
        temperature_celsius[0];

      update_Image_Source(temperature_celsius[0], "icon_based_present_temp");
      fetch_Temperature_For_Nextfivehrs(selected_city);
      //update_Live_Time(date_time);
      update_live_time_based_on_timezone(selected_city);
    } else {
      invalid_Cityname(date_of_a_city);
    }
  })();
}


/**
 *
 * Update source of the weather images based on the temperature 
 * @param {number} hour
 * @param {string} current_ampm
 * @return {void} nothing
 */
function ampm_Update_For_Nextfivehrs(hour, current_ampm) {
  let time_iterator = hour;
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    time_iterator++;
    var time_value = time_iterator;

   (time_value == 12 && current_ampm == "PM")?current_ampm = "AM":
   (time_value == 12 && current_ampm == "AM")?current_ampm = "PM":
   (time_value > 12 && current_ampm == "PM")?(time_value = time_value - 12,current_ampm = "PM"):
   (time_value > 12 && current_ampm == "AM")?(time_value = time_value - 12,current_ampm = "AM"):
   (time_value < 12 && current_ampm == "PM")?current_ampm = "PM":current_ampm = "AM";
    
    document.getElementById(id_name).innerHTML = time_value + current_ampm;
  }
}

// middle section
var sunny_list=[];
var snow_list=[];
var rainy_list=[];

for (let city in weather_data)
{
  if(parseInt(weather_data[city].temperature)>29 && parseInt(weather_data[city].humidity)<50 && parseInt(weather_data[city].precipitation)>=50)
  sunny_list.push(weather_data[city]);
  else if((parseInt(weather_data[city].temperature)>=20  && parseInt(weather_data[city].temperature)<=28) && parseInt(weather_data[city].humidity)>50 && parseInt(weather_data[city].precipitation)<50)
  snow_list.push(weather_data[city]);
  else if(parseInt(weather_data[city].temperature)<20 && parseInt(weather_data[city].humidity)>=50)
  rainy_list.push(weather_data[city]);
}
sunny_list.sort((a,b)=> a.temperature<b.temperature?1:-1);
snow_list.sort((a,b)=> a.precipitation<b.precipitation?1:-1);
rainy_list.sort((a,b)=> a.humidity<b.humidity?1:-1);
// console.log(sunny_list);
// console.log(snow_list);
// console.log(rainy_list);


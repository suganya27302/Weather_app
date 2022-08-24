let cityname;
let cityname_list = [];

const cities = document.getElementById("browsers");
for (const city_weather in weather_data) {
  const options = document.createElement("OPTION");
  options.setAttribute("value", weather_data[city_weather].cityName);
  cities.appendChild(options);
  cityname_list.push(weather_data[city_weather].cityName.toLowerCase());
}

const date = document.getElementsByClassName("date-style");
const time = document.getElementsByClassName("time-color");

function cityname_fetch() {
  let check_cityname = (cityname) => {
    for (let name of cityname_list) {
      if (cityname == name) {
        return true;
      }
    }
    return false;
  };

  cityname = document.getElementById("browser").value.toLowerCase();
  if (check_cityname(cityname)) {
    const image_path = "./ASSETS/" + cityname + ".svg";
    document.getElementById("icon").src = image_path;

    let date_time = weather_data[cityname].dateAndTime;
    date_time = date_time.split(",");
    let city_date = date_time[0];
    let city_time = date_time[1];
    city_date = city_date.split("/");
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let date_of_city = () => {
      if (city_date[1] >= 1 && city_date[1] <= 9) {
        return `0${city_date[1]}-  ${month[city_date[0] - 1]}-  ${
          city_date[2]
        }`;
      }
      return `${city_date[1]}-${month[city_date[0] - 1]}-${city_date[2]}`;
    };
    city_date = date_of_city();
    date[0].innerHTML = city_date;

    city_time = city_time.split(":");
    time[0].innerHTML =
      city_time[0] +
      ": " +
      city_time[1] +
      ": " +
      "<small>" +
      city_time[2].slice(0, 3) +
      "</small>";

    if (city_time[2].slice(3, 5) == "PM")
      document.getElementById("amimg").src = "./ASSETS/pmState.svg";
    else document.getElementById("amimg").src = "./ASSETS/amState.png";

    let temperature_celsius = weather_data[cityname].temperature;
    temperature_celsius = temperature_celsius.split("°");
    document.getElementById("temp-celsius").innerHTML =
      temperature_celsius[0] + " " + temperature_celsius[1];

    let temperature_farenheit = weather_data[cityname].temperature;
    temperature_farenheit = temperature_farenheit.split("°");
    temperature_farenheit[0] = (
      (temperature_farenheit[0] * 9) / 5 +
      32
    ).toFixed(1);
    document.getElementById("temp-farenheit").innerHTML =
      temperature_farenheit[0] + " F";

    let humidity_value = weather_data[cityname].humidity;
    document.getElementById("humidity_percentage").innerHTML =
      humidity_value.slice(0, humidity_value.length - 1) + " %";

    let precipitation_value = weather_data[cityname].precipitation;
    document.getElementById("precipitation_percentage").innerHTML =
      precipitation_value.slice(0, precipitation_value.length - 1) + " %";

    document.getElementById("present_temperature").innerHTML =
      temperature_celsius[0];

    let time_iterator = city_time[0];
    let ampm = "",
      time_value;
    for (var count = 1; count <= 5; count++) {
      let id_name = `time-after-${count}hour`;
      time_iterator++;
      time_value = time_iterator;
      if (time_value == 12) {
        ampm = "PM";
      } else if (time_value > 12) {
        time_value = time_value - 12;
        ampm = "PM";
      } else ampm = "AM";
      document.getElementById(id_name).innerHTML = time_value + ampm;
    }

    let temp_image = document.getElementsByClassName("cloud-img");
    function image_source(temp_after_every_hour, temp_icon) {
      if (temp_after_every_hour >= 23 && temp_after_every_hour <= 29)
        document.getElementById(temp_icon).src = "./ASSETS/cloudyIcon.svg";
      else if (temp_after_every_hour < 18)
        document.getElementById(temp_icon).src = "./ASSETS/rainyIcon.svg";
      else if (temp_after_every_hour >= 18 && temp_after_every_hour <= 22)
        document.getElementById(temp_icon).src = "./ASSETS/windyIcon.svg";
      else if (temp_after_every_hour > 29)
        document.getElementById(temp_icon).src = "./ASSETS/sunnyIcon.svg";
    }

    image_source(temperature_celsius[0], "icon_based_present_temp");

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

      image_source(temp_after_every_hour, temp_icon);
    }
  } else {
    document.getElementById("icon").src = "./ASSETS/warning.svg";
    date[0].innerHTML = "NIL";
    time[0].innerHTML = "NIL";
    document.getElementById("amimg").src = "./ASSETS/warning.svg";
    document.getElementById("temp-celsius").innerHTML = "NIL";
    document.getElementById("temp-farenheit").innerHTML = "NIL";
    document.getElementById("humidity_percentage").innerHTML = "NIL";
    document.getElementById("precipitation_percentage").innerHTML = "NIL";
    document.getElementsByClassName("cloud-img").src = "./ASSETS/warning.svg";
    document.getElementById("present_temperature").innerHTML = "nil";
    document.getElementById("present_time").innerHTML='nil';
    document.getElementById("icon_based_present_temp").src="./ASSETS/warning.svg";
    for (var count = 1; count <= 5; count++) {
      let id_name = `time-after-${count}hour`;
      document.getElementById(id_name).innerHTML ='nil';
    }
    for (var count = 1; count <= 5; count++) {
      let celsius_temperature = `temp-after-${count}hour`;
      let temp_icon = `icon_based_tempafter-${count}hour`;
      document.getElementById(celsius_temperature).innerHTML ='nil';
      document.getElementById(temp_icon).src="./ASSETS/warning.svg";
    }
  }
}

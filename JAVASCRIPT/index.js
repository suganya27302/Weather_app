
let cityname_list = [];
let timeout;
// Import cityname from json to the datalist
(function () {
  const cities_list = document.getElementById("city_lists");
  for (const city_weather in weather_data) {
    const options = document.createElement("OPTION");
    options.setAttribute("value", weather_data[city_weather].cityName);
    cities_list.appendChild(options);
    cityname_list.push(weather_data[city_weather].cityName.toLowerCase());
  }
})();

//Check the cityname is valid or not
let check_Cityname = (cityname) => {
  for (let name of cityname_list) {
    if (cityname == name) {
      return true;
    }
  }
  return false;
};

//Update the city icon based on city
function update_Icon_Image_Source(cityname) {
  const image_path = "./ASSETS/" + cityname + ".svg";
  document.getElementById("icon").src = image_path;
}

// Update the date based on city
function update_Date_Based_On_City(cityname, date_time,  date_of_a_city) {
  var date_of_city = new Date(date_time);
  date = date_of_city.getDate();
  month = date_of_city.toLocaleString("en-US", {
    month: "short",
  });
  year = date_of_city.getFullYear();

  let city_date = (function () {
    if (date >= 1 && date <= 9) {
      return `0${date}- ${month}- ${year}`;
    }
    return `${date}-${month}-${year}`;
  })();
  date_of_a_city[0].innerHTML = city_date;
}

// Update ampm image source based on the time
function ampm_Image_Update(current_ampm) {
  if (current_ampm == "PM")
    document.getElementById("amimg").src = "./ASSETS/pmState.svg";
  else document.getElementById("amimg").src = "./ASSETS/amState.png";
}

// Update live time of the city
function Update_live_time(date_time) {
  let current_ampm;
  var hour = new Date(date_time).getHours();
  var minute = new Date(date_time).getMinutes();
  var second = new Date(date_time).getSeconds();
  console.log(hour);
  if (hour == 0) {
    hour = 12;
    current_ampm = "AM";
  } else if (hour < 12) {
    current_ampm = "AM";
  } else if (hour == 12) {
    current_ampm = "PM";
  } else {
    current_ampm = "PM";
    hour = hour - 12;
  }
  document.getElementById("time_in_seconds").innerHTML = second;
  document.getElementById("time_in_minutes").innerHTML = minute + ": ";
  document.getElementById("time_in_hour").innerHTML = hour + ": ";
  ampm_Image_Update(current_ampm);
  clearInterval(timeout);

  function display_time() {
    console.log(second);
    if (second < 60) {
      second++;
      if (second < 10)
        document.getElementById("time_in_seconds").innerHTML = "0" + second;
      else if (second < 60) {
        document.getElementById("time_in_seconds").innerHTML = second;
      }
    } else if (second == 60 && minute == 59) {
      second = 0;
      minute++;
      if (minute == 60) {
        minute = 0;
        hour++;
        document.getElementById("time_in_seconds").innerHTML = "0" + second;
        document.getElementById("time_in_minutes").innerHTML =
          "0" + minute + ": ";
        if (hour < 10)
          document.getElementById("time_in_hour").innerHTML = "0" + hour + ": ";
        else if (hour < 12)
          document.getElementById("time_in_hour").innerHTML = hour + ": ";
        else if (hour == 12) {
          document.getElementById("time_in_hour").innerHTML = hour + ": ";
          current_ampm = "PM";
          ampm_Image_Update(current_ampm);
        } else if (hour > 12) {
          current_ampm = "PM";
          ampm_Image_Update(current_ampm);
          hour = hour - 12;
          document.getElementById("time_in_hour").innerHTML = "0" + hour + ": ";
        }
      }
    } else if (minute < 60) {
      second = 0;
      minute++;
      if (minute < 10)
        document.getElementById("time_in_minutes").innerHTML =
          "0" + minute + ": ";
      else if (minute < 59) {
        document.getElementById("time_in_minutes").innerHTML = minute + ": ";
      }
      if (minute == 60) {
        hour++;
        minute = 0;
        document.getElementById("time_in_minutes").innerHTML =
          "0" + minute + ": ";
        if (hour < 10)
          document.getElementById("time_in_hour").innerHTML = "0" + hour + ": ";
        else if (hour < 12)
          document.getElementById("time_in_hour").innerHTML = hour + ": ";
        else if (hour == 12) {
          document.getElementById("time_in_hour").innerHTML = hour + ": ";
          current_ampm = "PM";
          ampm_Image_Update(current_ampm);
        } else if (hour > 12) {
          current_ampm = "PM";
          ampm_Image_Update(ampm);
          hour = hour - 12;
          document.getElementById("time_in_hour").innerHTML = hour + ": ";
        }
      }
    } else if (hour <= 12) {
      minute = 0;
      hour++;
      if (hour < 10)
        document.getElementById("time_in_hour").innerHTML = "0" + hour + ": ";
      else if (hour < 12)
        document.getElementById("time_in_hour").innerHTML = hour + ": ";
    } else if (hour > 12) {
      current_ampm = "PM";
      ampm_Image_Update(current_ampm);
      hour = hour - 12;
      document.getElementById("time_in_hour").innerHTML = hour + ": ";
    }
    ampm_Update_For_Nextfivehrs(hour, current_ampm);
  }
  timeout = setInterval(display_time, 1000);
}

// Update the Temperature in celsius ,in farenheit and humidity ,precipitation
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

// Update Icon based on temperature
function update_Image_Source(temp_after_every_hour, temp_icon) {
  if (temp_after_every_hour >= 23 && temp_after_every_hour <= 29)
    document.getElementById(temp_icon).src = "./ASSETS/cloudyIcon.svg";
  else if (temp_after_every_hour < 18)
    document.getElementById(temp_icon).src = "./ASSETS/rainyIcon.svg";
  else if (temp_after_every_hour >= 18 && temp_after_every_hour <= 22)
    document.getElementById(temp_icon).src = "./ASSETS/windyIcon.svg";
  else if (temp_after_every_hour > 29)
    document.getElementById(temp_icon).src = "./ASSETS/sunnyIcon.svg";
}

// Fetch the temperature for the next five years from the current time
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

// The cityname is not valid ,it display nil
function invalid_Cityname( date_of_a_city,time_of_a_city) {
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

// Update the data based on cityname
function update_Data_On_Cityname() {
  let selected_city = document.getElementById("city_list").value.toLowerCase();
  const date_of_a_city = document.getElementsByClassName("date-style");
  const time_of_a_city = document.getElementsByClassName("time-color");
  return (function () {
    if (check_Cityname(selected_city)) {
      let date_time = weather_data[selected_city].dateAndTime;
      let temperature_celsius = weather_data[selected_city].temperature;
      temperature_celsius = temperature_celsius.split("°");

      update_Icon_Image_Source(selected_city);
      update_Date_Based_On_City(selected_city, date_time,  date_of_a_city);
      update_Temperature(selected_city, temperature_celsius);

      document.getElementById("present_time").innerHTML = "NOW";
      document.getElementById("present_temperature").innerHTML =
        temperature_celsius[0];

      update_Image_Source(temperature_celsius[0], "icon_based_present_temp");
      fetch_Temperature_For_Nextfivehrs(selected_city);
      Update_live_time(date_time);
    } else {
      invalid_Cityname( date_of_a_city, time_of_a_city);
    }
  })();
}

// Update ampm for the next five hours.
function ampm_Update_For_Nextfivehrs(hour, current_ampm) {
  let time_iterator = hour;
  for (var count = 1; count <= 5; count++) {
    let id_name = `time-after-${count}hour`;
    time_iterator++;
    var time_value = time_iterator;

    if (time_value == 12 && current_ampm == "PM") {
      current_ampm = "AM";
    } else if (time_value == 12 && current_ampm == "AM") {
      current_ampm = "PM";
    } else if (time_value > 12 && current_ampm == "PM") {
      time_value = time_value - 12;
      current_ampm = "PM";
    } else if (time_value > 12 && current_ampm == "AM") {
      time_value = time_value - 12;
      current_ampm = "AM";
    } else if (time_value < 12 && current_ampm == "PM") current_ampm = "PM";
    else current_ampm = "AM";
    document.getElementById(id_name).innerHTML = time_value + current_ampm;
  }
}

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

  cityname = document.getElementById("browser").value.toLowerCase();
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
}

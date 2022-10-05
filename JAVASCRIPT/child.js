const timezone = require("@suganya27/weather_data");
/* The listener will receive a message from server.js(parent) and based on that
 *  message a particular function is called and the resulted data is returned to server.js.
 */
process.on("message", (message) => {
  let Data;
  if (message.Sendmessage == "GetTemperature") {
    Data = timezone.nextNhoursWeather(
      message.cityDTN,
      message.hours,
      message.weatherData
    );
  } else if (message.Sendmessage == "GetcityInfo") {
    Data = timezone.timeForOneCity(message.cityname);
  } else if (message == "GetData") {
    Data = timezone.allTimeZones();
  }
  process.send(Data);
  process.exit();
});

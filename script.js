const API_KEY = "224b91f3-d732-462b-8d01-6cf8715b7b19";

const icon = new Skycons({ color: "#222" });
const locationElement = document.querySelector("[data-location]");
const statusElement = document.querySelector("[data-status]");
const temperatureElement = document.querySelector("[data-temperature]");
const humidityElement = document.querySelector("[data-humidity]");
const aqiElement = document.querySelector("[data-aqi]");
icon.set("icon", "cloudy");
icon.play();

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

const advice = document.getElementById("advice");
const precaution = document.getElementById("precaution");

fetch(
  `https://api.airvisual.com/v2/nearest_city?key=${API_KEY}`,
  requestOptions
)
  .then((response) => response.text())
  .then((result) => {
    setWeatherData(JSON.parse(result));
  })
  .catch((error) => console.log("error", error));

function setWeatherData(data) {
  locationElement.textContent = `${data.data.city}, ${data.data.state}, ${data.data.country}`;
  let status = function () {
    if (data.data.current.pollution.aqius <= 50) return "Good";
    else if (
      data.data.current.pollution.aqius > 50 &&
      data.data.current.pollution.aqius <= 100
    )
      return "Satisfactory";
    else if (
      data.data.current.pollution.aqius > 100 &&
      data.data.current.pollution.aqius <= 200
    )
      return "Moderately Polluted";
    else if (
      data.data.current.pollution.aqius > 200 &&
      data.data.current.pollution.aqius <= 300
    )
      return "Poor";
    else if (
      data.data.current.pollution.aqius > 300 &&
      data.data.current.pollution.aqius <= 400
    )
      return "Very Poor";
    else if (data.data.current.pollution.aqius > 400) return "Severe";
  };
  statusElement.textContent = status();
  temperatureElement.textContent = `${data.data.current.weather.tp}°C`;
  humidityElement.textContent = `${data.data.current.weather.hu}%`;
  aqiElement.textContent = data.data.current.pollution.aqius;

  if (data.data.current.pollution.aqius <= 50) {
    advice.innerText = "Stay away from dust or smoke.";
    precaution.innerText =
      "The AQI level is within safe limits. No significant risk to you health today.";
  } else if (data.data.current.pollution.aqius > 50) {
    advice.innerText =
      "It is highly advisable to wear a mask whenever you're outdoors. If you have any senior citizens at home, it is recommended that you have an air purifier at home.";
    precaution.innerText =
      "As the AQI today is above 50, it may cause your asthma to worsen. It would be better if you kept your inhaler with you if you plan to travel today.";
  }
}

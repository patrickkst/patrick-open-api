async function getCoords(name) {
  //function for API call to enter name to get latitude and longitude using geolocation.
  try {
    const responses = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${name}`,
    );
    if (!responses.ok) {
      const message = `An error occurred:${response.status}`;
      throw new Error(message);
    }
    const data = await responses.json();
    const firstResult = data.results[0]; //picks the first option out the results from the data
    const coords1 = firstResult.latitude;
    const coords2 = firstResult.longitude;
    const resultName = firstResult.name;
    getWeather(coords1, coords2, resultName); //calls function with latitude, longitude and name as arguments to get weather data
    return { lat: coords1, long: coords2, name: resultName }; //returns latitude, longitude and name
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
//Depending on the weather code from the api call it returns the value
function getWeatherDescription(code) {
  // WMO weather condition codes I got from the WMO CODE TABLE
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail",
  };
  return weatherCodes[code] || "Unknown Weather";
}

async function getWeather(lat, long, name) {
  //will use fetch to call weather API by using latitude and longitude we will get weather information
  const roundedLat = lat.toFixed(2);
  const roundedLong = long.toFixed(2);
  try {
    const responses = await fetch(
      //gets temperature,weather,day or night, depending on the city given
      `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLong}&current=temperature_2m,is_day,weather_code&timezone=America%2FNew_York&temperature_unit=fahrenheit`,
    );
    if (!responses.ok) {
      const message = `An error occurred:${response.status}`;
      throw new Error(message);
    }
    //I store the data we got from the fetch call and store it in variables like temperature and weather conditions
    const data = await responses.json();
    const temperature = data.current.temperature_2m;
    const weatherCode = data.current.weather_code;
    //calls function weather condition and passes the weather_code as argument
    const weatherDescription = getWeatherDescription(weatherCode);
    //consoles log the values from the promise
    console.log("Current Temperature:", temperature);
    console.log("Weather Code:", weatherCode);
    console.log("Weather Description:", weatherDescription);
    //inserts the text of the temperature and weather conditions into p element by ID
    document.getElementById("temperature").textContent =
      `Temperature: ${temperature}°F`;
    document.getElementById("weather-code").textContent =
      `Conditions: ${weatherDescription}`;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function getCity() {
  //This string passed
  const buttonSubmit = document.getElementById("buttonSubmit");
  const textbox = document.getElementById("textbox");

  buttonSubmit.addEventListener("click", () => {
    const inputValue = textbox.value.trim();
    //if the value from the textbox is submitted empty it will cause the textbox to light up red and eventually after 2 seconds return back to normal.
    if (inputValue === "") {
      textbox.style.borderColor = "#ff6b6b";
      textbox.style.backgroundColor = "#ffe0e0";
      setTimeout(() => {
        textbox.style.borderColor = "";
        textbox.style.backgroundColor = "";
      }, 2000);
      return;
    }

    console.log(getCoords(inputValue)); //calls getCoords and logs the value from the geolocation, latitude and longitude of a city
  });
}

getCity();

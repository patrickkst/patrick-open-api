async function getCoords(name) {
  //function for API call to enter name to get latitute and longitude using geolocation.
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
    getWeather(coords1, coords2, resultName); //calls function with latitude, longitude and name as arguments
    return { lat: coords1, long: coords2, name: resultName }; //returns latitude, longitude and name
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function getWeather(lat, long, name) {
  //will use fetch to call weather API by using latitude and longitude we will get weather information
  const roundedLat = lat.toFixed(2);
  const roundedLong = long.toFixed(2);
  try {
    const responses = await fetch(
      //gets temperature,weather,day or night, dending on the city given
      `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLong}&current=temperature_2m,is_day,weather_code&timezone=America%2FNew_York&temperature_unit=fahrenheit`,
    );
    if (!responses.ok) {
      const message = `An error occurred:${response.status}`;
      throw new Error(message);
    }
    const data = await responses.json();
    console.log(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
console.log(getCoords("New York"));

// API call for 5 day forecast: http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// API call to get LAT/LON coordinates for city name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// API Key: 25adc732fcb0ebbfd462bcfae063f791
//===================================================================================

var submitEl = $("#submit-button");
var forecastEl = $("#forecast");

// Stores city name to local storage when the submit button is clicked and adds to recently searched cities list
submitEl.on("click", function (e) {
  e.preventDefault();

  var citySearch;
  citySearch = $('input[name="city-name"]').val();
  localStorage.setItem("CityName", citySearch);

  cityConvert();
  getForecast();

  var recentCityButton = $("<button>");
  recentCityButton.addClass("recent-search");
  recentCityButton.addClass(citySearch);
  recentCityButton.text(citySearch);
  $("aside").append(recentCityButton);
});

// Converts stored city name to lat/lon coordinates
function cityConvert() {
  var cityName = window.localStorage.getItem("CityName");
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&limit=5&appid=25adc732fcb0ebbfd462bcfae063f791"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var cityLat = data[0].lat;
      var cityLon = data[0].lon;
      window.localStorage.setItem("CityLat", cityLat);
      window.localStorage.setItem("CityLon", cityLon);
    });
}

// Gets 5-day forecast based on lat/lon coordinates
function getForecast() {
  var cityLat = window.localStorage.getItem("CityLat");
  var cityLon = window.localStorage.getItem("CityLon");
  var cityName = window.localStorage.getItem("CityName");

  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&units=imperial&appid=25adc732fcb0ebbfd462bcfae063f791"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var roundedTemp = Math.round(data.list[0].main.temp);
      $(".selectedCity").text(cityName + " " + data.list[0].dt_txt);
      $(".currentTemp").text("Temp: " + roundedTemp + " \u00B0F");
      $(".currentWind").text("Wind: " + data.list[0].wind.speed + " MPH");
      $(".currentHumidity").text(
        "Humidity: " + data.list[0].main.humidity + "%"
      );
    });
}

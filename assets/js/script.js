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
  if ($('input[name="city-name"]').val() == "") {
    return;
  } else {
    citySearch = $('input[name="city-name"]').val();
    localStorage.setItem("CityName", citySearch);

    var recentCityButton = $("<button>");
    recentCityButton.addClass("recent-search");
    recentCityButton.addClass(citySearch);
    recentCityButton.text(citySearch);
    $("aside").append(recentCityButton);
    cityConvert();

    $('input[name="city-name"]').val("");
  }
});

$("#city-search").on("click", ".recent-search", function (e) {
  var cityName = e.target.textContent;

  window.localStorage.setItem("CityName", cityName);
  cityConvert();
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
      getForecast();
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
      var iconID = data.list[0].weather[0].icon;
      var iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";

      // Displays Current Weather
      $("#icon").empty();
      $("#icon").append($("<img>", { src: iconURL, alt: "Weather Icon" }));

      $(".selectedCity").text(cityName + " " + data.list[0].dt_txt + " UTC");
      $(".currentTemp").text("Temp: " + roundedTemp + " \u00B0F ");
      $(".currentWind").text("Wind: " + data.list[0].wind.speed + " MPH");
      $(".currentHumidity").text(
        "Humidity: " + data.list[0].main.humidity + "%"
      );

      // Display 5-day forecast
      for (var i = 8; i < 40; i = i + 8) {
        roundedTemp = Math.round(data.list[i].main.temp);
        iconID = data.list[i].weather[0].icon;
        iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";

        $("#icon-" + i).empty();
        $("#icon-" + i).append(
          $("<img>", { src: iconURL, alt: "Weather Icon" })
        );
        $(".date-" + i).text(data.list[i].dt_txt + " UTC");
        $(".temp-" + i).text("Temp: " + roundedTemp + " \u00B0F ");
        $(".wind-" + i).text("Wind: " + data.list[i].wind.speed + " MPH");
        $(".humidity-" + i).text(
          "Humidity: " + data.list[i].main.humidity + "%"
        );
      }
    });
}

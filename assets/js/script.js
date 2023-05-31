// API call for 5 day forecast: http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// API call to get LAT/LON coordinates for city name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// API Key: 25adc732fcb0ebbfd462bcfae063f791
//===================================================================================

var submitEl = $("#submit-button");
var forecastEl = $("#forecast");
var searchHistoryEl = $("button");

// Stores city name to local storage when the submit button is clicked and adds to recently searched cities list
submitEl.on("click", function (e) {
  e.preventDefault();

  var citySearch;
  citySearch = $('input[name="city-name"]').val();
  localStorage.setItem("CityName", citySearch);

  var recentCityButton = $("<button>");
  recentCityButton.addClass("recent-search");
  recentCityButton.text(citySearch);
  $("aside").append(recentCityButton);
});

// Set a variable for the app ID
var appID = "&appid=7322295fe389f223910eff0b71cd593d";

// Today's weather url start
var url = "https://api.openweathermap.org/data/2.5/weather?q=";

// The 5 day forecast url start
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";

// Get today's date using moment.js
var currentDay = moment().format("Do MMMM YYYY");

// Create a function that creates a query URL for the ajax requests
function getQueryURL(urlStart) {
  var city = $("#city-input").val().trim();
  var countryCode = $("#country-code-input").val().trim();
  // If the country code is not left blank (as it is optional), add it to the query's URL
  // create a function to reuse for forecast query URL
  if (countryCode.length !== 0) {
    return urlStart + city + "," + countryCode + appID;
    // If the country code is left blank, leave it out of the query's URL
  } else {
    return urlStart + city + appID;
  }
}

// Create a function that executes when the search button is clicked
// This function will: 1) save search to local storage and add it to history
// 2) show today's weather and render a funny gif 3) create a pop up for when user
// input is invalid and thus ajax request fails 4) get the five day forecast
function showCityWeather(e) {
  e.preventDefault();

  // Perform an ajax request to receive JSON data from Open Weather API
  $.ajax({
    url: getQueryURL(url),
    method: "GET",
  })
    .then((response) => {
      // Clear previous history cards to stop them duplicating
      $("#history").empty();

      // Save city and country code to local storage
      var cityAndCode =
        JSON.parse(localStorage.getItem("cityAndCountry")) || [];
      console.log(cityAndCode);
      var cityObject = {
        city: response.name,
        countryCode: response.sys.country,
      };
      cityAndCode.push(cityObject);
      localStorage.setItem("cityAndCountry", JSON.stringify(cityAndCode));

      // Execute function that creates history cards (of the local storage data) in the side article
      showHistory();

      // Execute function that shows today's weather forecast
      showTodayWeather(response);

      // Add function that sends an ajax request to giphy in order to retrieve a funny gif
      getFunnyGif();
    })
    .fail(() => {
      // if the ajax request fails, create a pop up asking the user to pick
      // a valid city and/or country code
      var cardEl = $("<div>").attr("class", "card");
      var cardBody = $("<div>")
        .attr("class", "card-body p-2 border border-danger")
        .text("Please put a valid city and/or country code!");
      cardEl.append(cardBody);
      $(".country-code").append(cardEl);
      // remove the pop up after a designated amount of time
      setTimeout(() => {
        cardEl.remove();
      }, 1800);
    });
  // Send another ajax request to retrieve the 5 day weather forecast
  $.ajax({
    url: getQueryURL(forecastURL),
    method: "GET",
  }).then(function (response) {
    // add dynamically created elements for the 5 day forecast
    console.log(response);
    // clear input fields after all requests are fulfilled
    $("#city-input").val("");
    $("#country-code-input").val("");
    //
    show5DayForecast(response);
  });
}
// Create a function that adds elements of today's weather dynamically 
function showTodayWeather(data) {
  $("#today").html(
    '<div class="card h-100 overflow-hidden text-center">' +
      '<div class="row">' +
      '<div class="col-md-6 col-12 d-flex align-items-center">' +
      '<div class="card-body">' +
      '<div class="align-self-center">' +
      '<div class="px-3">' +
      '<h4 class="card-title text-bold mb-2">' +
      data.name +
      ", " +
      data.sys.country +
      "</h4>" +
      '<p class="card-text text-muted mb-0">' +
      currentDay +
      "</p>" +
      "<img " +
      'src="http://openweathermap.org/img/wn/' +
      data.weather[0].icon +
      '@2x.png"' +
      'alt="weather icon"' +
      "/>" +
      '<p class="card-text mt-0 mb-0 lead">Temperature: ' +
      kelvinToCelsius(data.main.temp).toFixed(1) +
      "°C</p>" +
      '<small class="text-muted">Humidity: ' +
      data.main.humidity +
      "%  Wind Speed: " +
      // data is in meters per second. To get mph, multiply the result by 2.23694 (weather.gov website)
      (2.23694 * data.wind.speed).toFixed(2) +
      "mph" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-6 col-12">' +
      '<div class="card-img">' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
  );
}

function getFunnyGif() {
  // Send an ajax request to giphy in order to retrieve a funny gif
  // set the search query term to 'mind blown' and set limit to 10
  var giphyURL =
    "https://api.giphy.com/v1/gifs/search?api_key=C8sDCpfJWsC7twWiaUf8zG1stQempp5S&q=mind%20blown&limit=10&offset=0&rating=g&lang=en";

  $.ajax({
    url: giphyURL,
    method: "GET",
  }).then((gifData) => {
    console.log(gifData);
    // Randomly select an index from the data retrieved (limit is set to 10 gifs)
    // place the URL of random gif into a variable
    var randomIndex = Math.floor(Math.random() * 10);
    var gifSrc = gifData.data[randomIndex].images.original.url;

    // Add the gif source (the url) to an image element and append it to the card-img class
    $(".card-img").append(
      "<img " +
        'class="img-fluid proj-img w-100 h-100"' +
        'src="' +
        gifSrc +
        '"' +
        'alt="weather gif"' +
        "/>"
    );
  });
}

function show5DayForecast(response) {
// Make sure the forecast section is empty to stop elements from duplicating 
  $("#forecast").empty();

  // Store indexes of the response's data list (which correlate to dates) in an array
  var index = [7, 15, 23, 31, 39];
  var days = [];

  // Add each date to a previously empty array of days 
  for (var day of index) {
    days.push(moment(response.list[day].dt_txt).format("ddd, Do MMM"));
  }
  // For each element in the index array, dynamically create a forecast card that displays future weather 
  for (var i = 0; i < index.length; i++) {
    var div = $("<div>");
    div.attr("class", "col d-flex align-items-center forecast-card");

    var card = $("<div>");
    card.attr("class", "card-body");
    card.html(
      '<p class="card-text text-muted mb-0">' +
        days[i] +
        "</p>" +
        "<img " +
        'src="http://openweathermap.org/img/wn/' +
        response.list[index[i]].weather[0].icon +
        '@2x.png"' +
        'alt="weather icon"' +
        "/>" +
        '<p class="card-text mt-0 mb-0 lead">Temp: ' +
        kelvinToCelsius(response.list[index[i]].main.temp).toFixed(1) +
        "°C</p>" +
        '<small class="text-muted">Humidity: ' +
        response.list[index[i]].main.humidity +
        "% <br>  Wind: " +
        // data is in meters per second. To get mph, multiply the result by 2.23694 (weather.gov website)
        (2.23694 * response.list[index[i]].wind.speed).toFixed(1) +
        "mph" +
        "</div>"
    );

    div.append(card);
    $("#forecast").append(div);
  }
}
// Create a function that dynamically adds a history card for each city in local storage
function showHistory() {
  var cityAndCode = JSON.parse(localStorage.getItem("cityAndCountry")) || [];
  for (var cities of cityAndCode) {
    var card = $("<div>").attr("class", "card");
    var historyEl = $("<div>")
      .attr(
        "class",
        "card-body p-2 mb-2 border border-primary text-center history-card history-element"
      )
      .text(cities.city + ", " + cities.countryCode);
    card.append(historyEl);
    $("#history").prepend(card);
  }
}

// Store a function that can convert kelvin into celsius
var kelvinToCelsius = (kelvin) => kelvin - 273.15;

// When the search button is clicked, execute showCityWeather function
$("#search-button").on("click", showCityWeather);

// When a history card is clicked, display the data for that particular card
// (both today's weather and the 5 day weather forecast)
$("#history").on("click", ".history-element", () => {
  var arr = $(this).text().split(", ");
  var city = arr[0];
  var code = arr[1];
  queryURL = url + city + ", " + code + appID;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((r) => {
    showTodayWeather(r);
    getFunnyGif();
  });

  var newQueryURL = forecastURL + city + ", " + code + appID;
  $.ajax({
    url: newQueryURL,
    method: "GET",
  }).then((data) => {
    show5DayForecast(data);
  });
});

// Create a function that clears local and empties history section
function clear() {
    $("#history").empty();
    localStorage.clear();
  }

// When clear history button is clicked, execute 'clear' function
$("#clear-history").on("click", clear);

// Show previous search results in the left hand article 
showHistory();

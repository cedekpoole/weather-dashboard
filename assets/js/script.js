// Set a variable for the beginning of the URL and app ID
var queryURL = "";
var url = "https://api.openweathermap.org/data/2.5/weather?q=";
var appID = "&appid=7322295fe389f223910eff0b71cd593d";
 // Get today's date using moment.js
var currentDay = moment().format("Do MMMM YYYY");

function showCityWeather(e) {
  e.preventDefault();

  // Get the city and the country code from the user's input
  var city = $("#city-input").val().trim();
  var countryCode = $("#country-code-input").val().trim();

  // If the country code is not left blank (as it is optional), add it to the query's URL
  // create a function to reuse for forecast query URL
  function checkCountryCode(urlStart) {
    if (countryCode.length !== 0) {
      queryURL = urlStart + city + "," + countryCode + appID;
      // If the country code is left blank, leave it out of the query's URL
    } else {
      queryURL = urlStart + city + appID;
    }
  }
  // call function that creates URL dependent on whether country code is included or not
  checkCountryCode(url);

  // perform an ajax request to receive JSON data from Open Weather API
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      var card = $("<div>").attr("class", "card");
      var historyEl = $("<div>")
        .attr(
          "class",
          "card-body p-2 mb-2 border border-primary text-center history-card history-element"
        )
        .text(response.name + ", " + response.sys.country);
      card.append(historyEl);
      $("#history").prepend(card);

    
    showTodayWeather(response)

    // Send an ajax request to giphy in order to retrieve a funny gif 
    getFunnyGif()

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
  
  // send an ajax request for the 5 day forecast
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";

  // check whether user has included country code + create URL for ajax request
  checkCountryCode(forecastURL);

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // add dynamically created elements for the 5 day forecast
    console.log(response);
    // clear input fields after all requests are fulfilled
    $("#city-input").val("");
    $("#country-code-input").val("");


  });
}

function clear() {
  $("#history").empty();
}
// store a function that can convert kelvin into celsius 
var kelvinToCelsius = (kelvin) => kelvin - 273.15;

$("#search-button").on("click", showCityWeather);

$("#history").on("click", ".history-element", function() {
    var arr = $(this).text().split(", ");
    var city = arr[0]
    var code = arr[1]
    queryURL = url + city + ", " + code + appID;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(r => {
        showTodayWeather(r);
        getFunnyGif();
    })

})

$("#clear-history").on("click", clear);

function showTodayWeather(data) {
    $("#today").html(
        '<div class="card h-100 overflow-hidden text-center">' +
            '<div class="row">' +
            '<div class="col-sm-6 col-12 d-flex align-items-center">' +
                '<div class="card-body">' +
                '<div class="align-self-center">' +
                    '<div class="px-3">' +
                    '<h4 class="card-title text-bold mb-2">' + data.name + ', ' + data.sys.country + '</h4>' +
                    '<p class="card-text text-muted mb-0">' + currentDay + '</p>' +
                    '<img ' + 
                        'src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png"' +
                        'alt="weather icon"' +
                    '/>' +
                    '<p class="card-text mt-0 mb-0 lead">Temperature: ' +
                        kelvinToCelsius(data.main.temp).toFixed(1) +
                    '°C</p>' +
                    '<small class="text-muted">Humidity: ' + 
                        data.main.humidity + 
                        '%  Wind Speed: ' + 
                        // data is in meters per second. To get mph, multiply the result by 2.23694 (weather.gov website)
                        (2.23694 * data.wind.speed).toFixed(2) + 'mph' +
                    '</div>' +
                '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-6 col-12">' +
                '<div class="card-img">' +
                '</div>' +
            '</div>' +
            '</div>' +
        '</div>'
      )
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
    // randomly select an index from the data retrieved (limit is set to 10 gifs)
    // place the URL of random gif into a variable
    var randomIndex = Math.floor(Math.random() * 10)
    var gifSrc = gifData.data[randomIndex].images.original.url;

    // add the gif source (the url) to an image element and append it to the card-img class
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
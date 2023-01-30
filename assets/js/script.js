function showCityWeather(e) {
  e.preventDefault();
  // Get the city and the country code from the user's input
  var city = $("#city-input").val().trim();
  var countryCode = $("#country-code-input").val().trim();
  // Set a variable for the beginning of the URL and app ID
  var url = "https://api.openweathermap.org/data/2.5/weather?q=";
  var appID = "&appid=7322295fe389f223910eff0b71cd593d";
  var queryURL = "";

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
          "card-body p-2 mb-2 border border-primary text-center history-card"
        )
        .text(city + ", " + response.sys.country);
      card.append(historyEl);
      $("#history").prepend(card);
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
    // clear input fields after both requests are fulfilled
    $("#city-input").val("");
    $("#country-code-input").val("");
  });
}

$("#search-button").on("click", showCityWeather);

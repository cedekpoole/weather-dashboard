function formulateQueryURL(e) {
    e.preventDefault();
    var city = $("#city-input").val().trim();
    var countryCode = $("#country-code-input").val().trim();
    var url = "https://api.openweathermap.org/data/2.5/weather?q="
    var queryURL = "";
    if (countryCode.length !== 0) {
        queryURL = url + city + "," + countryCode + "&appid=7322295fe389f223910eff0b71cd593d"
    } else {
        queryURL = url + city + "&appid=7322295fe389f223910eff0b71cd593d"
    }
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

    })
}

$("#search-button").on("click", formulateQueryURL)

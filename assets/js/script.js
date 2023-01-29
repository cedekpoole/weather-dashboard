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
    }).then(function(data) {
        console.log(data);
    }).fail(function(response) {
        var cardEl = $("<div>").attr("class", "card");
        var cardBody = $("<div>").attr("class", "card-body").text("Please put a valid city!");
        cardEl.append(cardBody);
        $("#search-form").append(cardEl);
        setTimeout(function() {
            cardEl.remove();
        }, 1500)
    })
}

$("#search-button").on("click", formulateQueryURL)

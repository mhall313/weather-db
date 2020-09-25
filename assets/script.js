//To remove any potential syncing issues on load
$(document).ready(function(){
var dt = new Date;
var mainCard = $(".main-card")

var month = new Array(12);
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";

var calD = month[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear();
mainCard.find(".date").html(calD);


//What do we need to accomplish
//When a city is entered - present current & future cond
    //Aka given user input populate cards

//STEP A - Save input from Search

//STEP B - Ajax call to openweatherapp for user input info    
    //Make call dynamic based on variables so easily updated for new cities
function currentWeather(){
    //city variable will be move to whatever the user clicks
    var cityName = "Richmond";
    var APIkey = "84e4a73dbe21261105a8b82f64a0523a";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&units=imperial&appid=" + APIkey
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
        mainCard.find(".current-city").html(response.name + ", " + response.sys.country);
        mainCard.find(".temp").html(Math.floor(response.main.temp) + "° F");
        $(".weather-icon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        mainCard.find(".humid").html("Humidity: "+Math.floor(response.main.humidity) + "%");
        mainCard.find(".wind-speed").html("Wind Speed: "+Math.floor(response.wind.speed)+"mph");
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        

        //nest ajax ... 
        var APIkey = "84e4a73dbe21261105a8b82f64a0523a";
        var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon="+lon+"&appid=" + APIkey
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            mainCard.find(".uv-index").html("UV Index: "+Math.floor(response.value));
        })
    })
}
currentWeather();


    

//STEP C - When search history is clicked update cards to that city







    
})
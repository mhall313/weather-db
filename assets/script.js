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

//Variables for API calls and local storage
var cityNames = [];
var APIkey = "84e4a73dbe21261105a8b82f64a0523a";


//What do we need to accomplish
//Start screen
function init(){
    //Styling and model visibility
    $(".side-bar").css("opacity", "0");
    $(".main-content").css("opacity","0");
    $(".modal").toggle(); //this needs to get rid of not toggle
    //initialize local storage
    var storedCities = JSON.parse(localStorage.getItem("cityNames"));
    if(storedCities !== null){
        cityNames = storedCities;
    }
    renderCities();
}
init();
//Hide/close model when "x" is clicked, toggle opacity to side bar and main content
$(".close").click(function(event){
    event.preventDefault();
    $(".modal"). toggle(); //this needs to get rid of not toggle
    $(".side-bar").css("opacity", "100%");
    $(".main-content").css("opacity","100%");
    $(".card-deck").css("opacity", "0");
    $(".five-day").css("opacity","0");
    $(".main-card").html("To see the weather forecast, please search for your city.");
})
//When a city is entered - present current & future cond
    //Save user input and run weather functions
$(".search-button").click(function(event){
    event.preventDefault();
    var city = $(this).parent("form").find("input").val();
    console.log(city);
    if(city !== ""){
        //STEP A - Save input from Search
        localStorage.setItem("city",JSON.stringify(city));
        cityNames.push(city);
        storeCities();
        renderCities();
        $(".search-button").val = "";
        $(".modal"). toggle();
        $(".side-bar").css("opacity", "100%");
        $(".main-content").css("opacity","100%");
        storeCities();
        renderCities();
        currentWeather();
        futureWeather();
    }
    else{
        $(".modal"). toggle();
        $(".side-bar").css("opacity", "100%");
        $(".main-content").css("opacity","100%");
        $(".card-deck").css("opacity", "0");
        $(".five-day").css("opacity","0");
        $(".main-card").html("To see the weather forecast, please search for your city."); 
    }
})

function storeCities(){
    localStorage.setItem("cityNames", JSON.stringify(cityNames));
}

function renderCities(){
    //populate list items
    $(".list-group").html("");
    $.each(cityNames, function(index, value){
        var li = $("<li>");
        li.addClass("list-group-item");
        li.html(value);
        $(".list-group").append(li);
    });
}

//STEP B - Ajax call to openweatherapp for user input info    
    //Make call dynamic based on variables so easily updated for new cities
function currentWeather(){
    //this will need to get the newest item from local storage and call it cityName
    var cityName = cityNames[cityNames.length-1];
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&units=imperial&appid=" + APIkey
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        mainCard.find(".current-city").html(response.name + ", " + response.sys.country);
        mainCard.find(".temp").html(Math.floor(response.main.temp) + "° F");
        mainCard.find(".weather-icon").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        mainCard.find(".humid").html("Humidity: "+Math.floor(response.main.humidity) + "%");
        mainCard.find(".wind-speed").html("Wind Speed: "+Math.floor(response.wind.speed)+"mph");
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        

        //nest ajax ... 
        var APIkey = "84e4a73dbe21261105a8b82f64a0523a";
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon="+lon+"&appid=" + APIkey
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            mainCard.find(".uv-index").html("UV Index: "+Math.floor(response.value));
        })
    })
}

function futureWeather(){
    //also call from local storage CityName
    var cityName = cityNames[cityNames.length-1];
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&units=imperial&appid=" + APIkey
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        for(var i =0; i < 5; i++){
            var card = $(".day-"+[i]);
            var humidity = $("<div>");
            if(i===0){
                var forecastDay = moment(response.list[i].dt_txt);
                var temp = Math.floor(response.list[i].main.temp);
                var humidPercent = Math.floor(response.list[i].main.humidity);
                var wIcon = response.list[i].weather[0].icon;
            }
            else{
                j = i*8;
                var forecastDay = moment(response.list[j].dt_txt);
                var temp = Math.floor(response.list[j].main.temp);
                var humidPercent = Math.floor(response.list[j].main.humidity);
                var wIcon = response.list[j].weather[0].icon;
            }
            card.find(".forecast-day").html(forecastDay.format("ddd"));
            card.find(".date").html(forecastDay.format("MMM Do"))
            card.find(".weather-icon").attr("src", "https://openweathermap.org/img/wn/" + wIcon + "@2x.png");
            card.find(".temp-humid").html(temp+ "° F");
            humidity.html("Humidity: "+ humidPercent + "%");
            card.find(".temp-humid").append(humidity);
            
        }
    })

}

//STEP C - When search history is clicked update cards to that city







    
})
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

    //Variables for API calls and local storage set up
    var cityNames = [];
    //localStorage.clear();   //for testing
    var APIkey = "84e4a73dbe21261105a8b82f64a0523a";

    //Start screen - show modal requesting initial search input, hide via opacity the side-bar and main-content. Initializes local storage by populating cityNames with any from local storage 
    function init(){
        //Styling and model visibility
        $(".side-bar").css("opacity", "0");
        $(".main-content").css("opacity","0");
        $(".modal").toggle();
        //initialize local storage
        var storedCities = JSON.parse(localStorage.getItem("cityNames"));
        if(storedCities !== null){
            cityNames = storedCities;
        }
        renderCities();
    }
    init();

    //Hide/close model when "x" is clicked, does not search weather rather displays message requesting city to search
    $(".close").click(function(event){
        event.preventDefault();
        $(".modal"). toggle(); //this needs to get rid of not toggle
        $(".side-bar").css("opacity", "100%");
        $(".main-content").css("opacity","100%");
        $(".card-deck").css("opacity", "0");
        $(".five-day").css("opacity","0");
        $(".main-card").html("To see the weather forecast, please search for your city.");
    })

    //When the search button is clicked - set city to value of input field and run searchCity
    $(".search-button-1").click(function(event){
        event.preventDefault();
        var city = $(this).parent("form").find("input").val();
        if(city !== ""){
            $(".search-button").val = "";
            $(".side-bar").css("opacity", "100%");
            $(".main-content").css("opacity","100%");
            searchCity(city);
        }
        else{
            $(".side-bar").css("opacity", "100%");
            $(".main-content").css("opacity","100%");
            $(".card-deck").css("opacity", "0");
            $(".five-day").css("opacity","0");
            $(".main-card").html("To see the weather forecast, please search for your city."); 
        }
        $(".modal"). toggle();
        storeCities();
        renderCities();
    })

    $(".search-button-2").click(function(event){
        event.preventDefault();
        var city = $(this).parent("form").find("input").val();
        $(this).parent("form").find("input").html("");
        $(this).parent("form").find("input").attr("placeholder", "City Name");
        searchCity(city);
        storeCities();
        renderCities();
    }) 

    //When search history is clicked update cards to that city
    $(".list-group").on("click", "li.list-group-item",(function(event){
        var city = $(this).html();
        searchCity(city);
    }))


    //if input field is empty display please enter city to search message, if it is not empy log to local storage and run functions to store the user input, render any previously searched cities and display current and forecasted weather of the city searched
    function searchCity(city){
        //Save input from Search
        localStorage.setItem("city",JSON.stringify(city));
        cityNames.push(city);
        currentWeather(city);
        futureWeather(city);
    }


    //Store array of cities to local storage
    function storeCities(){
        localStorage.setItem("cityNames", JSON.stringify(cityNames));
    }

    //render cities in local storage as list group items
    function renderCities(){
        //populate list items - how to avoid multiple adds when search is clicked
        $(".list-group").html("");
        $.each(cityNames, function(index, value){
            var li = $("<li>");
            li.addClass("list-group-item");
            li.html(value);
            $(".list-group").prepend(li);
        });
    }

    //Ajax call to openweatherapp of user input city to display current weather and icon    
        //Dynamic based on variables so easily updated for new cities
    function currentWeather(cityName){
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
            

            //Secondary AJAX call to show UVIndex due to different queryURL
            var APIkey = "84e4a73dbe21261105a8b82f64a0523a";
            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon="+lon+"&appid=" + APIkey
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function(response){
                $(".uv-number").html(Math.floor(response.value));
                warningUV();
            })
        })
    }

    //Ajax call to openweatherapp of user input city to display 5 day weather forecast and icons  
        //Dynamic based on variables so easily updated for new cities
    function futureWeather(cityName){
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
    //color code UV index
    function warningUV(){
        var uvIndex = $(".uv-number").html();
        if(uvIndex <= 2){
            $(".uv-number").addClass("mild");
            $(".uv-number").removeClass("moderate");
            $(".uv-number").removeClass("severe");
        }
        else if(uvIndex > 2 && uvIndex <= 5){
            $(".uv-number").addClass("moderate");
            $(".uv-number").removeClass("mild");
            $(".uv-number").removeClass("severe");
        }
        else{
            $(".uv-number").addClass("severe");
            $(".uv-number").removeClass("mild");
            $(".uv-number").removeClass("moderate");
        }
    }

//What's left:
    //add state to current city header
    //what if they type in non-sense
    //Clear search feild after search
})

var key = "8b316af2cd911d56c695445d7a5a016a";
var cityName;


$("#searchForm").on("click", "#searchCity", function(event) {
    event.preventDefault();
    var cityName = $('input[name=city]').val();
    var cityName = cityName.trim();
    geoGet(cityName);
});

$("#searchForm").on("click", ".prevCity", function(event) {
    event.preventDefault();
    var cityButton = $(this).attr("value");
    geoGet(cityButton);
});
//gets the longitude and latitute on start
var geoGet = function(cityName){
    var geoAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key;
    fetch(geoAPI).then(function(response){ 
    if (response.ok) {
        response.json().then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        weatherReport(lat, lon);
        fiveDayReport(lat, lon);
        cityLog(cityName);
      });
    } else {
      document.location.replace("./index.html");
    }
  });
   
};

geoGet("New York");


var cityLog = function(cityName, lat, lon) {
    if(localStorage.getItem("cities") === null){
        localStorage.setItem("cities", "[]")
    }
    var cityLogged = {
        city: cityName,
        lat: lat,
        lon: lon,
    }
    
    var tempStorage = JSON.parse(localStorage.getItem('cities'));
  
    for(let i = 0; i < tempStorage.length; i++){
        if(tempStorage[i].lat === cityLogged.lat && tempStorage[i].lon === cityLogged.lon){
            break;
            
        }else if(i === tempStorage.length - 1){
            tempStorage.push(cityLogged);
            localStorage.setItem("cities", JSON.stringify(tempStorage));
            var city = cityLogged.city;
            var cityButton = $((document.createElement('input')));
            cityButton.attr("type", "submit");
            cityButton.attr("value", city); 
            cityButton.addClass("prevCity w-100 m-1");
            $("#searchField").append(cityButton);
        }
        
    }
}

var localStorageButtons = function(){
    var tempStorage = JSON.parse(localStorage.getItem('cities'));
    for(var i = 0; i < tempStorage.length; i++){
        
        var cityButton = $((document.createElement('input')));
        var city = tempStorage[i].city;
        cityButton.attr("type", "submit");
        cityButton.attr("value", city); 
        cityButton.addClass("prevCity w-100 m-1");
        $("#searchField").append(cityButton);
       
        
    }
}

localStorageButtons();

//current weather report
var weatherReport = function(lat, lon) {
    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    
    
    
    fetch(weatherAPI).then(function(response){ 
        if (response.ok) {
            response.json().then(function(data) {
            weatherPopulate(data, lat, lon);
          });
        } else {
          document.location.replace("./index.html");
        }
      });
};

var weatherPopulate = function(data) {
   
    let cityInfo = {
        city:(data.name),
        icon: "http://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png",
        temp:(data.main.temp + "°F"),
        wind:(data.wind.speed + " mph"),
        humid:(data.main.humidity + "%"),
    }
    $("#city").text("City: " + cityInfo.city);
    $("#icon").attr("src", cityInfo.icon);
    $("#temp").text("Temp: " + cityInfo.temp);
    $("#wind").text("Wind: " + cityInfo.wind);
    $("#humid").text("Humidity: " + cityInfo.humid);
    
}

//five day weather report 
var fiveDayReport = function(lat, lon) {
   var fiveWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+key+"&units=imperial";
   fetch(fiveWeatherAPI).then(function(response){ 
    if (response.ok) {
        response.json().then(function(data) {
        weatherPopulateFive(data);
      });
    } else {
      document.location.replace("./index.html");
    }
  });
}

var weatherPopulateFive = function(data) {
    
    
    $("#fiveDay").children(".card").each(function(index){
        
        var newDate = data.list[index * 8].dt_txt.split(" ")

        var dayReport = {
            date:newDate[0],
            icon:"http://openweathermap.org/img/wn/" + (data.list[index * 8].weather[0].icon)  + "@2x.png",
            temp:data.list[index * 8].main.temp + "°F",
            wind:data.list[index * 8].wind.speed  + " mph",
            humid:data.list[index * 8].main.humidity  + "%",
        };

        $(this).find(".name").text("Date: " + dayReport.date);
        $(this).find(".icon").attr("src", dayReport.icon);
        $(this).find(".temp").text("Temp: " + dayReport.temp);
        $(this).find(".wind").text("Wind: " + dayReport.wind);
        $(this).find(".humid").text("Humid: " + dayReport.humid);
    })
}
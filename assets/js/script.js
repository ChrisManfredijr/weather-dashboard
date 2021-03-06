var key = "8b316af2cd911d56c695445d7a5a016a";



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
    var geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key;
    fetch(geoAPI).then(function(response){ 
    if (response.ok) {
        response.json().then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var uvAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon + '&exclude=hourly,daily&appid=' + key;
        fetch(uvAPI).then(function(response){
            if(response.ok){
                response.json().then(function(data) {
                    var uvi = data.current.uvi;
                    
                    weatherReport(lat, lon, uvi);
                    fiveDayReport(lat, lon);
                    cityLog(cityName, lat, lon);
                });
            }
        });
        
        
      });
    } else {
      document.location.replace("./index.html");
    }
  });
   
};

geoGet("New York");


var cityLog = function(cityName, lat, lon) {
   
    var cityLogged = {
        city: cityName,
        lat: lat,
        lon: lon,
    }
    if(localStorage.getItem("cities") === null || localStorage.getItem('cities') === "[]"){
        var tempStorage = JSON.parse(localStorage.getItem('cities'));
        console.log("test");
        localStorage.setItem("cities", "[]");
        tempStorage.push(cityLogged);
            localStorage.setItem("cities", JSON.stringify(tempStorage));
            var city = cityLogged.city;
            var cityButton = $((document.createElement('input')));
            cityButton.attr("type", "submit");
            cityButton.attr("value", city); 
            cityButton.addClass("prevCity w-100 m-1");
            $("#searchField").append(cityButton);

    }
    var tempStorage = JSON.parse(localStorage.getItem('cities'));
 

    for(let i = 0; i < tempStorage.length; i++){
        if(tempStorage[i].lat === cityLogged.lat && tempStorage[i].lon === cityLogged.lon){
            console.log("2");
            break;
            
            
        }else if(i === tempStorage.length - 1){
            console.log("3");
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
    if(tempStorage !== null){
        
        for(var i = 0; i < tempStorage.length; i++){
            
            var cityButton = $((document.createElement('input')));
            var city = tempStorage[i].city;
            cityButton.attr("type", "submit");
            cityButton.attr("value", city); 
            cityButton.addClass("prevCity w-100 m-1");
            $("#searchField").append(cityButton);
           
            
        }

    }
}

localStorageButtons();

//current weather report
var weatherReport = function(lat, lon, uvi) {
    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    
    
    
    fetch(weatherAPI).then(function(response){ 
        if (response.ok) {
            response.json().then(function(data) {
            weatherPopulate(data, uvi);
          });
        } else {
          document.location.replace("./index.html");
        }
      });
};

var weatherPopulate = function(data, uvi) {
   
    let cityInfo = {
        city:(data.name),
        icon: "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png",
        temp:(data.main.temp + "??F"),
        wind:(data.wind.speed + " mph"),
        humid:(data.main.humidity + "%"),
        uv: uvi,
    }
    $("#city").text("City: " + cityInfo.city);
    $("#icon").attr("src", cityInfo.icon);
    $("#temp").text("Temp: " + cityInfo.temp);
    $("#wind").text("Wind: " + cityInfo.wind);
    $("#humid").text("Humidity: " + cityInfo.humid);
    $("#uv").text("UV index: " + cityInfo.uv);

    
    if(cityInfo.uv < 3.0){
        $("#uv").text("UV index: " + cityInfo.uv);
        $("#uv").addClass("bg-success w-25");
    }else if(cityInfo.uv <  6.0 ){
        $("#uv").text("UV index: " + cityInfo.uv);
        $("#uv").addClass("bg-warning w-25");
    }else{
        $("#uv").text("UV index: " + cityInfo.uv);
        $("#uv").addClass("bg-danger w-25");
    };
    
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
            icon:"https://openweathermap.org/img/wn/" + (data.list[index * 8].weather[0].icon)  + "@2x.png",
            temp:data.list[index * 8].main.temp + "??F",
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
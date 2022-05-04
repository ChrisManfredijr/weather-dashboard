var key = "8b316af2cd911d56c695445d7a5a016a";
var cityName;

$("#searchForm").on("click", "#searchCity", function(event) {
    event.preventDefault();
    var cityName = $('input[name=city]').val();
    var cityName = cityName.trim();
    geoGet(cityName);
})

var geoGet = function(cityName){
    var geoAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key;
    fetch(geoAPI).then(function(response){ 
    if (response.ok) {
        response.json().then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        weatherReport(lat, lon);
      });
    } else {
      document.location.replace("./index.html");
    }
  });
   
};

var weatherReport = function(lat, lon) {
    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(weatherAPI).then(function(response){ 
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data);
          });
        } else {
          document.location.replace("./index.html");
        }
      });
};
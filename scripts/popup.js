var description = document.getElementById('weatherDescription');
var curr = document.getElementById('currTemp');
var city = document.getElementById('city');
var weatherPic = document.getElementById('weatherPic');
var iBlock = document.getElementById('informationBlock');
var eBlock = document.getElementById('errorShow');

getLocation();

function getLocation (){
    if (navigator.geolocation) {
        notError();
        navigator.geolocation.getCurrentPosition(getWeather);
    } else {
        errorHandle("Geolocation is not supported by this browser");
    }
}
function getWeather(position){
    var xhttp = new XMLHttpRequest();
    //longitude.innerHTML = position.coords.longitude;
    //latitude.innerHTML = position.coords.latitude;
    xhttp.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID=7e490e770b74fb92f3cdd351664a1c22&units=Imperial", true);
    xhttp.onload = function() {
        var data = JSON.parse(xhttp.responseText);
        tempData = data["main"];
        curr.innerHTML = Math.round(tempData["temp"]);
        city.innerHTML = data["name"];
        description.innerHTML = data["weather"][0]["description"];
        weatherPic.src = 'http://openweathermap.org/img/w/' + data["weather"][0]["icon"] + ".png";
    }
    xhttp.send();
    /**
    var fhttp = new XMLHttpRequest();
    fhttp.open("GET", "https://cors.io?https://api.darksky.net/forecast/57555d4fda958c3163e004edc806b1fd/" + position.coords.latitude + "," + position.coords.longitude, true);
    fhttp.onload = function() {
        var data = JSON.parse(fhttp.responseText);
        console.log("Temperature: " + data["currently"]["temperature"]);
        console.log("Feels like " + data["currently"]["apparentTemperature"]);
        console.log("High: " + data["daily"]["data"][0]["temperatureHigh"]);
        console.log("Low: " + data["daily"]["data"][0]["temperatureLow"]);
        }
    }
    fhttp.send();
    **/
}

function notError(){
    iBlock.style.visibility = 'visible';
    eBlock.style.visibility = 'hidden';
}
function errorHandle(message){
    iBlock.style.visibility = 'hidden';
    eBlock.style.visibility = 'visible';
    eBlock.innerHtml = message;
}

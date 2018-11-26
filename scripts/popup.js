var longitude = document.getElementById('longitude');
var latitude= document.getElementById('latitude');
var curr = document.getElementById('currTemp');
var high = document.getElementById('highTemp');
var low = document.getElementById('lowTemp');
var iBlock = document.getElementById('informationBlock');
var eBlock = document.getElementById('errorShow');

getLocation();

function getLocation (){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather);
    } else {
        errorHandle("Geolocation is not supported by this browser");
    }
}
function getWeather(position){
    var xhttp = new XMLHttpRequest();
    longitude.innerHTML = position.coords.longitude;
    latitude.innerHTML = position.coords.latitude;
    xhttp.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID=7e490e770b74fb92f3cdd351664a1c22&units=Imperial", true);
    xhttp.onload = function() {
        var data = JSON.parse(xhttp.responseText);
        tempData = data["main"];
        curr.innerHTML = Math.round(tempData["temp"]);
        low.innerHTML = Math.round(tempData["temp_min"]);
        high.innerHTML = Math.round(tempData["temp_max"]);
    }
    xhttp.send();

    var fhttp = new XMLHttpRequest();
    fhttp.open("GET", "https://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID=7e490e770b74fb92f3cdd351664a1c22&units=Imperial", true);
    fhttp.onload = function() {
        var data = JSON.parse(fhttp.responseText);
        tempData = data["list"];
        var d = new Date(0);
        for (var i=0; i< tempData.length; i++){
            d.setUTCSeconds(tempData[i]["dt"]);
            console.log(d);
            console.log(tempData[i]["temp_min"]);
            console.log(tempData[i]["temp_max"]);
            console.log("");
        }
    }
    fhttp.send();

}

function errorHandle(message){
    iBlock.style.visibility = 'hidden';
    eBlock.style.visibility = 'visible';
    eBlock.innerHtml = message;
}

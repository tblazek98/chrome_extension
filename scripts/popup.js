var description = document.getElementById('weatherDescription');
var curr = document.getElementById('currTemp');
var feels = document.getElementById('feelsTemp');
var highTemp = document.getElementById('highTemp');
var lowTemp = document.getElementById('lowTemp');
var precip = document.getElementById('precip');
var dailySum = document.getElementById('dailySum');

var weatherPic = document.getElementById('weatherPic');
var iBlock = document.getElementById('informationBlock');
var eBlock = document.getElementById('errorShow');

var deg = "&#176";

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    var fhttp = new XMLHttpRequest();
    fhttp.open("GET", "https://cors.io?https://api.darksky.net/forecast/57555d4fda958c3163e004edc806b1fd/" + position.coords.latitude + "," + position.coords.longitude + "?exclude=minutely", true);
    fhttp.onload = function() {
        var data = JSON.parse(fhttp.responseText);
        current = data["currently"];
        daily = data["daily"]["data"];
        currTemp.innerHTML =  Math.round(current["temperature"]) + deg;
        feelsTemp.innerHTML = Math.round(current["apparentTemperature"]) + deg;
        description.innerHTML = current["summary"];
        highTemp.innerHTML = "H " + Math.round(daily[0]["temperatureHigh"]) + deg+ " /";
        lowTemp.innerHTML = "L " + Math.round(daily[0]["temperatureLow"]) + deg;
        precip.innerHTML = "Chance of " + daily[0]["precipType"] + ": " + (daily[0]["precipProbability"] * 100) + "%";
        dailySum.innerHTML = daily[0]["summary"];

        var wIcon = new weatherIcon();
        wIcon.createIcon(current["icon"], "weatherIcon");
        var hourly = data["hourly"]["data"];
        var arr_canvas = [];
        for (var i=0; i<hourly.length; i++){
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", hourly[i]["icon"]);
            canvas.setAttribute("value", hourly[i]["time"]);
            canvas.setAttribute("width", "128");
            canvas.setAttribute("height", "128");
            canvas.setAttribute("class", "weatherPic");
            canvas.style.width = "30px";
            canvas.style.height = "auto";
            arr_canvas[i] = canvas;
        }
        var arr_icons = new weatherIcon();
        arr_icons.changeIcon(arr_canvas);
    }
    fhttp.send();
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

function weatherIcon(){
    this.createIcon = function(icon, id){
        this.skycons = new Skycons({"color": "blue"});
        console.log(icon);
        console.log(id);
        this.skycons.add(id, icon);
        this.skycons.play();
    }
    this.changeIcon = function(arr){
        this.icons = new Skycons();
        for (i=0; i<arr.length; i++){
            this.icons.add(arr[i], arr[i].id);
        }
        this.icons.play();
        var recent = 0;
        var div = document.createElement("div");
        for (i=0; i< arr.length; i++){
            var d = new Date((parseInt(arr[i].getAttribute("value")))*1000);
            if (i==0){
                var p = document.createElement("p");
                p.innerHTML = weekday[d.getDay()] ;
                div.appendChild(p);
                recent=d.getDate();
            }
            if (d.getDate() != recent) {
                pushDaily(div, recent);
                div = document.createElement("div");
                var p = document.createElement("p");
                p.innerHTML = weekday[d.getDay()];
                div.appendChild(p);
            }
            var figcap = document.createElement("p");
            figcap.setAttribute("class", "dailyWeather");
            figcap.innerHTML = returnTime(d.getHours());
            div.appendChild(figcap);
            div.appendChild(arr[i]);
            recent=d.getDate();
        }
        pushDaily(div, recent);
    }
}
function pushDaily(div, recent){
    div.setAttribute("id", recent);
    div.setAttribute("class", "dailyWeather");
    document.getElementById("hourlyData").appendChild(div);
    document.getElementById("hourlyData").appendChild(document.createElement("br"));
};
function returnTime(hour) {
    if (hour==0){
        return "12 AM";
    } else if (hour<12){
        return hour + " AM";
    } else if (hour==12){
        return "12 PM"  
    } else {
        return (hour-12) + " PM";
    }
};

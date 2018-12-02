var API_KEY = '57555d4fda958c3163e004edc806b1fd';

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
    fhttp.open("GET", "https://cors.io?https://api.darksky.net/forecast/" + API_KEY + "/" + position.coords.latitude + "," + position.coords.longitude + "?exclude=minutely", true);
    fhttp.onload = function() {
        var data = JSON.parse(fhttp.responseText);
        current = data["currently"];
        daily = data["daily"]["data"];
        currTemp.innerHTML =  Math.round(current["temperature"]) + deg;
        feelsTemp.innerHTML = Math.round(current["apparentTemperature"]) + deg;
        description.innerHTML = current["summary"];
        highTemp.innerHTML = "H " + Math.round(daily[0]["temperatureHigh"]) + deg+ " /";
        lowTemp.innerHTML = "L " + Math.round(daily[0]["temperatureLow"]) + deg;
        if (daily[0]["precipProbability"] != 0){
            precip.innerHTML = "Chance of " + daily[0]["precipType"] + ": " + (daily[0]["precipProbability"] * 100) + "%";
        } else {
            precip.innerHTML = "No chance of precipitation";
        }
        dailySum.innerHTML = daily[0]["summary"];
        var wIcon = new weatherIcon();
        wIcon.createIcon(current["icon"], "weatherIcon");
        var hourly = data["hourly"]["data"];
        var arr_canvas = [];
        for (var i=0; i<hourly.length; i++){
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", hourly[i]["icon"]);
            canvas.setAttribute("value", hourly[i]["time"]);
            canvas.setAttribute("temp", Math.round(hourly[i]["temperature"]));
            canvas.setAttribute("width", "128");
            canvas.setAttribute("height", "128");
            canvas.setAttribute("class", "weatherPic");
            arr_canvas[i] = canvas;
        }
        var daily = data["daily"]["data"];
        var arr_daily = [];
        for (var i=0; i<daily.length; i++){
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", daily[i]["icon"]);
            canvas.setAttribute("width", "128");
            canvas.setAttribute("height", "128");
            canvas.setAttribute("class", "weatherPic");
            arr_daily[i] = [ daily[i]["time"], canvas, daily[i]["temperatureLow"], daily[i]["temperatureHigh"] ];
        }
        var arr_icons = new weatherIcon();
        arr_icons.changeIcon(arr_canvas, arr_daily);
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
        this.skycons.add(id, icon);
        this.skycons.play();
    }
    this.changeIcon = function(arr, daily){
        this.icons = new Skycons();
        for (i=0; i<arr.length; i++){
            this.icons.add(arr[i], arr[i].id);
        }
        for (i=0; i<daily.length; i++){
            this.icons.add(daily[i][1], daily[i][1].id);
        }
        this.icons.play();
        var recent = 0;
        var j=0;
        count = 0;
        for (i=0; (i< arr.length)&&(count<24); i++){
            var d = new Date((parseInt(arr[i].getAttribute("value")))*1000);
            if ((count>23) || (i == 0)) {
                if (i!=0){
                    pushDaily(collectionHoursDiv, div, recent, true);
                } else {
                    recent=d.getDate();
                }
                div = document.createElement("div");
                var collectionHoursDiv = document.createElement("div");
                createDailyHeader(div, d.getDay(), daily[j][1], daily[j][2], daily[j][3]);
                j = j + 1;
                if (i != 0){
                    break;
                }
            }
            var figcap = document.createElement("p");
            var hourDiv = document.createElement("div");
            hourDiv.setAttribute("class", "dailyWeatherHour");
            figcap.innerHTML = returnTime(d.getHours());
            var topDiv = document.createElement("div");
            topDiv.innerHTML = returnTime(d.getHours());
            var midDiv = document.createElement("div");
            midDiv.appendChild(arr[i]);
            var botDiv = document.createElement("div");
            botDiv.innerHTML = "<span>" + arr[i].getAttribute("temp") + deg + "</span>";
            hourDiv.appendChild(topDiv);
            hourDiv.appendChild(midDiv);
            hourDiv.appendChild(botDiv);
            collectionHoursDiv.appendChild(hourDiv);
            recent=d.getDate();
            count = count + 1;
        }
        pushDaily(collectionHoursDiv, div, recent, true);

        for(; j<daily.length; j++){
            var d = new Date(daily[j][0]*1000);
            div = document.createElement("div");
            createDailyHeader(div, d.getDay(), daily[j][1], daily[j][2], daily[j][3]);
            var collection = document.createElement("div");
            pushDaily(collection, div, d.getDate(), false);

        }
    }
}
function pushDaily(collection, div, recent, display){
    collection.setAttribute("class", "collectionDailyWeather");
    div.appendChild(collection);
    div.setAttribute("id", recent);
    div.setAttribute("class", "dailyWeather");
    document.getElementById("hourlyData").appendChild(div);
    if (display == true){
        document.getElementById("hourlyData").appendChild(document.createElement("br"));
    }
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
function createDailyHeader(div, day, icon, low, high){
    var headerDiv = document.createElement("div");
    var p = document.createElement("p");
    p.setAttribute("class", "dailyLeft");
    p.innerHTML = weekday[day];
    var iconDiv = document.createElement("div");
    iconDiv.setAttribute("class", "dailyCenter");
    iconDiv.appendChild(icon);
    var p2 = document.createElement("p");
    p2.setAttribute("class", "dailyRight");
    p2.innerHTML = "<span>H " + Math.round(high) + deg + " / L " + Math.round(low) + deg + "</span>";
    headerDiv.appendChild(p);
    headerDiv.appendChild(iconDiv);
    headerDiv.appendChild(p2);
    div.appendChild(headerDiv);
}

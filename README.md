# Overview
This is a chrome extension to display the weather for the next week.
It uses the Dark Sky API, to get the weather data and it uses raw
javascript, css, and html to implement the front-end. 

## Installation
Open chrome and go to `chrome://extensions`. Activate developer mode and 
click load unpacked at the top. From there, navigate to the folder that
this is stored.

Create an account at Dark Sky (link below), and get an API key. Then 
change `API_KEY` in `scripts/popup.js` in line 1 to match your API key.

## Source
I used the [Dark Sky API](http://darksky.net/dev) for my weather data.

The Dark Sky API is not compliant with CORS, so I used [cors.io](https://cors.io)
which allows me to pass a link and it returns the API from Dark Sky.

This website also uses [skycons](https://github.com/darkskyapp/skycons) to show the icons
in the weather app and for the animation.

I used Google's font [Quicksand]("https://fonts.googleapis.com/css?family=Quicksand") for
my default font choice. I downloaded this locally so I would be working with a static library.

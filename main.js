//Get all necessary elements for The DOM

const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const WindOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

//Default City Name When the page Loads
let cityInput = "Tunis";
//add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //chaange the default city to the clicked one 
        cityInput = e.target.innerHTML;
        //fuction that fetch and display all data from WeatherAPI
        fetchWeatherData();
        //fade out the page (animation)
        app.style.opacity="0";
    });
});


//add sumbit event to the form
form.addEventListener('submit', (e) => {

    //if input field(search bar) empty throw an alert
    if (search.value.length == 0) {
        alert('Please type in a City name !');
    } else {
        //change default city name to the one written in search bar 
        cityInput = search.value;
        fetchWeatherData();
        search.value="";
    }
    //prevent the deault  behaviour of the form 
    e.preventDefault();

});

// function that return day of the week from a date 
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Friday",
        "Saturday",
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

/*function that FETCH and Display 
the data from WeatherAPI **/
function fetchWeatherData() {
    //fetch data & dynamically add the city name 
    fetch(`http://api.weatherapi.com/v1/current.json?key=0b9c308089ba4f83b30223337220605&q=${cityInput}&days=1&aqi=no&alerts=no`)

        /*takethe data (JSON format) and convert it to normal Js object */
        .then(response => response.json())
        .then(data => {
            console.log(data);


            /*add temperature and weather condition to the page */
            temp.innerHTML = data.current.temp_c + "&#176";
            conditionOutput.innerHTML = data.current.condition.text;

            /*get data and time for the city and extract the day , month , Year and time
            into individual variables */
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            /*reformating the date and adding it to page */
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
            timeOutput.innerHTML = time;
            /* add city name to page */
            nameOutput.innerHTML = data.location.name;
            /* get the corresponding icon url */
            const iconId = data.current.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/".length
            );
            icon.src = "./icons/" + iconId;

            /* add weather detail to page */
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            WindOutput.innerHTML = data.current.wind_kph + "km/h";

            /*set default time of day */
            let timeOfDay = "day";
            // Get unique id for each weather condition 
            const code = data.current.condition.code;

            //change to night depending on city current time 
            if (!data.current.is_day) {
                timeOfDay = "night";
            }
            if (code == 1000) {
                //set image background depending on weather status
                app.style.backgroundImage =
                    `url(./images/${timeOfDay}/clear.jpg)`;
                //change button color 
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
            /*some things for cloudy weather */
            else if (code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1035 ||
                code == 1237 ||
                code == 1279 ||
                code == 1282) {
                app.style.backgroundImage =
                    `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#1b7465";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";}
                }
                // And rain
                else if (
                    code == 1063 ||
                    code == 1069 ||
                    code == 1072 ||
                    code == 1150 ||
                    code == 1153 ||
                    code == 1180 ||
                    code == 1183 ||
                    code == 1186 ||
                    code == 1189 ||
                    code == 1192 ||
                    code == 1195 ||
                    code == 1204 ||
                    code == 1207 ||
                    code == 1240 ||
                    code == 1243 ||
                    code == 1246 ||
                    code == 1249 ||
                    code == 1276 ||

                    code == 1252) {
                    app.style.backgroundImage =
                        `url(./images/${timeOfDay}/rainy.jpg)`;
                    btn.style.background = "#647d75";
                    if (timeOfDay == "night") {
                        btn.style.background = "#325c80";
                    }
                    /* and finnaly snnow */
                } else {
                    app.style.backgroundImage =
                    'url(./images/${timeOfDay}/snow.jpg)';
                    btn.style.background = "#4d72aa";
                    if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                    }
                }
                //fade in the page once all is done 
                app.style.opacity = "1";
                })
        /*if user type in a city that dosen't exist throw in an error */
        .catch(() => {
            alert('City Not Found , Please Try Again');
        });
}
fetchWeatherData();
app.style.opacity = "1";
export default class Weather {
    constructor(api_key) {
        this.apiKey = api_key;

        //check if there is data in localstorage
            //check if data in localstorage is older than 10 minutes
            if (localStorage.getItem("weather") &&
                Date.now() - localStorage.getItem("timestamp") < 600000
            ) {
                //get data from localstorage
                const data = JSON.parse(localStorage.getItem("weather"));
                this.displayWeather(data);
                console.log("cached");
            } else {
                this.getLocation();
            }
    }
    
    getLocation() {        
        // Get the location from the browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
        } else {
            alert("Geolocation is not supported by this browser.");
        };
    };

    getWeather(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Get the weather from the API
        const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${this.apiKey}`
        
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            //save to localstorage
            localStorage.setItem("weather", JSON.stringify(data));
            //save timestamp
            localStorage.setItem("timestamp", Date.now());
        })
    }

    displayWeather(data) {
        const temp = data.data[0].temp;
        document.querySelector(".weather__temp").innerText = temp + "°C";

        const weather = data.data[0].weather.description;
        document.querySelector(".weather__summary").innerText = weather;

        const icon = data.data[0].weather.icon;
        //create img element
        const img = document.createElement("img");
        //set src attribute
        img.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
        //append img to the DOM
        document.querySelector(".weather__icon").appendChild(img);
    }      
};

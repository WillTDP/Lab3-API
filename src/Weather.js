export default class Weather {
    constructor(api_key) {
        this.apiKey = api_key;
        this.getLocation();
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
            this.displayWeather(data);
        });
    };

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

export default class Weather {
    constructor(api_key) {
        this.apiKey = api_key;
        //console.log(api_key);

        //check if there is data in localstorage
            //check if data in localstorage is older than 10 minutes
            if (localStorage.getItem("weather") &&
                Date.now() - localStorage.getItem("timestamp") < 600000
            ) {
                //get data from localstorage
                const data = JSON.parse(localStorage.getItem("weather"));
                this.displayWeather(data);
                this.defineDoctors(data);
               // console.log("cached");
            } else {
                this.getLocation();
            }
        /*//get doctors
        if (localStorage.getItem("doctors") &&
            Date.now() - localStorage.getItem("timestamp") < 6
        ) {
            //get data from localstorage
            const data = JSON.parse(localStorage.getItem("doctors"));
            this.defineDoctors(data);
            //console.log("cached");
        } else {
            this.defineDoctors();
            this.getDoctors();
            //console.log("not cached");
        }*/
    }
    
    getLocation() {        
        // Get the location from the browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
            //console.log("geolocation");
        } else {
            alert("Geolocation is not supported by this browser.");
        };
    };

    getWeather(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        //console.log("lat");
        
        // Get the weather from the API
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}&aqi=no`
        
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            //console.log(data);
            //save to localstorage
            localStorage.setItem("weather", JSON.stringify(data));
            //save timestamp
            localStorage.setItem("timestamp", Date.now());
        })
    }

    /*getDoctors() {
        const url = 'https://api.catalogopolis.xyz/v1/doctors'
        fetch(url)
        .then(response => response.json())
        .then((datas) => {
            //save to localstorage
            localStorage.setItem("doctors", JSON.stringify(datas));
            //save timestamp
            localStorage.setItem("timestamp", Date.now());
            //console.log(data);
        })
    }*/

    displayWeather(data) {
        const temp = data.current.temp_c;
        document.querySelector(".weather__temp").innerText = temp + "°C";
        //console.log(temp);

        const weather = data.current.condition.text;
        document.querySelector(".weather__summary").innerText = weather;

        const icon = data.current.condition.icon;
        //create img element
        const img = document.createElement("img");
        //set src attribute
        img.src = icon;
        //append img to the DOM
        document.querySelector(".weather__icon").appendChild(img);
    }      
    defineDoctors(data) {
        console.log(data);
        let doctor;
        if (data.current.temp_c < 5) {
          doctor = "1";
     
        } if (data.current.temp_c < 10) {
            doctor = "2";
          }
          if (data.current.temp_c < 15) {
            doctor = "3";
          }
         else {
          doctor = "12";
        }
        console.log(doctor + " " + "doctor");
        this.getDoctor(doctor);
      }
      getDoctor(doctor) {
        let url = `https://api.catalogopolis.xyz/v1/doctors/${doctor}`;
        console.log(url);
        fetch(url)
          .then((res) => {
            //console.log(res);
            return res.json();
          })
          .then((json) => {
            console.log(json);
            let dwdata = json.incarnation;
            console.log(dwdata);
            document.querySelector(".doctor__number").innerText = dwdata

            const icon = `assets/${doctor}.png`;
            console.log(icon);
            const img = document.createElement("img");
            img.src = icon;
            document.querySelector(".doctor__img").appendChild(img);
            img.setAttribute(
                'style',
                'width: 20%; height: 20%;', 
              );

          })
          .catch((err) => {
            console.log(err);
          });
         
      }

};

var res = fetch("https://restcountries.com/v2/all");
res.then((data)=> data.json()).then(function(data1){
        for(let i = 0; i <= data1.length; i++){

        if (i % 5 === 0) {
                rowDiv = document.createElement("div");
                rowDiv.setAttribute("class", "row");
                document.body.append(rowDiv);
        }

        var div = document.createElement("div");
        div.setAttribute("class", "col")
        div.innerHTML= 
                `
                <div class="card" style="width: 18rem;">
                <h5 class="card-header">${data1[i].name}</h5>
                <img src="${data1[i].flag}" class="card-img-top" alt="...">
                <div class="card-body">
                <p class="card-text">${"Capital: "+data1[i].capital}</p>
                <p class="card-text">${"Region: "+data1[i].region}</p>
                <p class="card-text">${"Country Code: "+data1[i].cioc}</p>
                <button class="weather-button">Check Weather</button>
                </div>
                </div>`
                rowDiv.append(div);
                document.body.append(rowDiv)



                const weatherButtons = document.querySelectorAll(".weather-button");
    weatherButtons.forEach(button => {
      button.addEventListener("click", function () {
        const countryName = this.getAttribute("data-country");
        fetchWeather(countryName, this.nextElementSibling.querySelector('.weather-info'));
      });
    });
  

function fetchWeather(countryName, weatherInfoContainer) {
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${apiKey}`;
  
  fetch(apiUrl)
    .then(response => {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            }).catch(error => {
              console.error('Error reading stream:', error);
              controller.error(error);
            });
          }
          push();
        }
      });
      return new Response(stream);
    })
    .then(response => response.json())
    .then(data => {
      const weatherInfo = `
        <p>Weather in ${countryName}:</p>
        <p>Description: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;
      weatherInfoContainer.innerHTML = weatherInfo;
      weatherInfoContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

}});





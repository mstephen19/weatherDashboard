const weatherArea = $('#weatherContainer')
const forecastArea = $('#forecastContainer')

const cityInput = $('#cityInput');
const submitBtn = $('#submitBtn');
let latLonArr = [];
let weatherArr;

function getLongLat(event){
  event.preventDefault()
  cityToSearch = cityInput.val();
  // console.log(cityToSearch);
  let userInputUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39';
  fetch(userInputUrl, {
    cache: 'reload',
  })
    .then(function (response){
      // console.log(response)
      //error
      if (response.status !== 200) {
        console.log('please enter a city')
      }
      return response.json();
    })
    .then(function(data){
      // console.log(data);
      latLonArr = [data[0].lat, data[0].lon];
      // console.log(latLonArr)
      getWeather();
    })
}
// quick test
// var testing = setInterval(function(){
//   console.log(latLonArr)
// }, 1000)
function getWeather(){
  // console.log(latLonArr);
  let weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latLonArr[0] + '&lon=' + latLonArr[1] +'&units=metric&appid=6f7fcdfd5baf071bea56c4dc9633ff39';
  // console.log(weatherUrl);
  fetch(weatherUrl, {
    cache: 'reload',
  })
    .then(function (response){
      return response.json();
    })
    .then(function(data){
      // console.log(data);
      weatherArr = data;
      // console.log(weatherArr);
      createElements();
    })
}

function createElements(){
  console.log(weatherArr);
  var dateNow = moment.unix(weatherArr.current.dt).format("DD/MM/YYYY");
  let tempNow = weatherArr.current.temp;
  let windSpeedNow = weatherArr.current.wind_speed;
  let humidityNow = weatherArr.current.humidity;
  let uvIndexNow = weatherArr.current.uvi;
  //set now

  //BE SURE TO GET THE DATE TOO AND

  $('#cityName').text(cityInput.val() + ', ' + dateNow)
  $('#temperature').text('Temperature: ' + Math.floor(tempNow) + ' C');
  $('#windSpeed').text('Wind Speed: ' + windSpeedNow + 'km/h');
  $('#humidity').text('Humidity: ' + humidityNow + '%');
  $('#uvIndex').text('UV: ' + uvIndexNow);
  if (uvIndexNow < 3) {
    $('#uvIndex').css('background-color', 'green');
  } else if (uvIndexNow > 6) {
    $('#uvIndex').css('background-color', 'red');
  } else {
    $('#uvIndex').css('background-color', 'yellow');
  }

  
  let nextDaysArr = weatherArr.daily;
  // set next 5 days for loop for each create card

  //at end of function
  cityInput.val('')
}

submitBtn.on('click', getLongLat);

//for the buttons, just paste the text into the cityInput.val() so you don't have to write another function for it
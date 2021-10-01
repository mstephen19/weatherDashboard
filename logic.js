$(document).ready(function(){
  const sideContain = $('#sideContainer')
  const weatherArea = $('#weatherContainer');
  const forecastArea = $('#forecastContainer');
  const cards = document.querySelector('#cardsContainer').children;
  const cityInput = $('#cityInput');
  const submitBtn = $('#submitBtn');
  let latLonArr = [];
  let weatherArr;
  let cityToSearch = '';
  let btnsToArray = [];

  $(function loadBtns(){
    let pulledValues = JSON.parse(localStorage.getItem('prevBtns'))
    pulledValues;
    //console.log(pulledValues);
    for (let i=0;i<pulledValues.length;i++){
      btnsToArray.push(pulledValues[i]);
      $('<button>').addClass('previous').text(pulledValues[i]).appendTo(sideContain);
      //console.log(pulledValues[i])
    }
  });

  // .includes(cityToSearch)
  function getLongLat(event){
    event.preventDefault();
    cityToSearch = cityInput.val();
    //console.log(cityToSearch);
    // for (let i=0;i<sideBtns.length;i++){
    //   btnsToArray.push(sideBtns[i].textContent)
    // }
      if (!(btnsToArray.includes(cityToSearch))) {
        $('<button>').text(cityToSearch).addClass('previous').appendTo(sideContain)
        btnsToArray.push(cityToSearch);
      }
      // console.log(btnsToArray)
      localStorage.setItem('prevBtns', JSON.stringify(btnsToArray));

    let userInputUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39';
    fetch(userInputUrl, {
      cache: 'reload',
    })
      .then(function (response){
        // console.log(response)
        //error
        if (response.status !== 200) {
          console.log('Please enter a city')
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
    // console.log(weatherArr);
    var dateNow = moment.unix(weatherArr.current.dt).format("DD/MM/YYYY");
    let weatherIcon = weatherArr.current.weather[0].icon;
    let weatherIconLink = 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png'
    let tempNow = weatherArr.current.temp;
    let windSpeedNow = weatherArr.current.wind_speed;
    let humidityNow = weatherArr.current.humidity;
    let uvIndexNow = weatherArr.current.uvi;
    //set now
    //console.log('THE ICON LINK: ' + weatherIconLink)

    //BE SURE TO SET ICONS TOO

    document.getElementById('mainImage').setAttribute('src', weatherIconLink)
    $('#cityName').text(cityInput.val() + ', ' + dateNow)
    $('#temperature').text('Temperature: ' + Math.floor(tempNow) + ' °C');
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
    console.log(nextDaysArr);
    for (let i = 0; i < 5; i++){
      let weatherIconCards = nextDaysArr[i].weather[0].icon;
      let weatherIconLinkCards = 'http://openweathermap.org/img/wn/' + weatherIconCards + '@2x.png'

      cards[i].children[0].children[0].textContent = moment.unix(nextDaysArr[i].dt).format("DD/MM/YYYY");
      cards[i].children[0].children[1].setAttribute('src', weatherIconLinkCards);
      cards[i].children[0].children[2].textContent = 'Temp: ' + Math.floor(nextDaysArr[i].temp.day) + ' °C';
      cards[i].children[0].children[3].textContent = 'Wind: ' + nextDaysArr[i].wind_speed + 'km/h';
      cards[i].children[0].children[4].textContent = 'Humidity: ' + nextDaysArr[i].humidity + '%';
      cards[i].children[0].children[5].textContent = 'UV: ' + nextDaysArr[i].uvi;
    }

    //at end of function
    cityInput.val('')
  }

  submitBtn.on('click', getLongLat);

  //for the buttons, just paste the text into the cityInput.val() so you don't have to write another function for it
  sideContain.on('click', function(event){
    let btnClicked = event.target;
    cityInput.val(btnClicked.textContent);
    //console.log(btnClicked.textContent);
    cityToSearch = cityInput.val();
    let userInputUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39';
    fetch(userInputUrl, {
      cache: 'reload',
    })
      .then(function (response){
        if (response.status !== 200) {
          console.log('please enter a city')
        }
        return response.json();
      })
      .then(function(data){
        latLonArr = [data[0].lat, data[0].lon];
        getWeather();
      })
  })
})
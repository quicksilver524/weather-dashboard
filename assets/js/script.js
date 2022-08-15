// Global Variables
var formEl = document.querySelector(".search-form");
var citySearchEl = document.querySelector("#city");
var currentDayContainer = document.querySelector(".current-day-content");
var fiveDayWrapper = document.querySelector(".five-day-wrapper");
var historyWrapper = document.querySelector(".history");
var deleteBtn = document.querySelector(".delete-btn");

// Form Submit Handler
var formSubmitHandler = function (event) {
  // Prevent Page from reloading
  event.preventDefault();

  // Get the city name and uppercase the first letter
  var cityName = citySearchEl.value.trim();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  // If user leaves form blank, inform them to put valid name
  if (cityName) {
    getCurrentCityWeather(cityName);
    getFiveDayForcast(cityName);
    citySearchEl.value = "";
    createHistoryButton();
  } else {
    alert("Please input a city!");
    formSubmitHandler();
  }
};

// Save cities to local storage
var saveCities = function (city) {
  // Grab City out of local storage
  var currentCity = JSON.parse(localStorage.getItem("cityItems")) || [];

  // If new city input is same as one already in local storage, do not store into local storage
  let set = new Set(currentCity);
  set.add(city);
  const newArr = Array.from(set);
  localStorage.setItem("cityItems", JSON.stringify(newArr));
};

// Delete history function
var deleteHistory = function () {
  // When user clicks delete button, local storage will be cleared
  localStorage.clear();

  // Force reoad onclick so that the buttons will disappear
  location.reload();
};

// History Click Handler
var historyClickHandler = function (event) {
  // Declare which city clicked
  var historyEl = event.target.getAttribute("data-city");

  // If valid city, run functions
  if (historyEl) {
    getCurrentCityWeather(historyEl);
    getFiveDayForcast(historyEl);
  }
};

// Get current city weather
var getCurrentCityWeather = function (city) {
  // Define API URL
  var weatherApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";

  // Fetch that URL
  fetch(weatherApiUrl).then(function (response) {
    // If respone is in 200's run code...
    if (response.ok) {
      // Parse the fetch response to json format
      response.json().then(function (data) {
        //Run functions
        displayCurrentCityWeather(data);
        getCurrentUvIndex(data);
        saveCities(city);
      });
    } else {
      // If no city exists and page results in 400 code- alert user
      alert("Please insert a valid city!");
    }
  });

  //Create History Buttons
  createHistoryButton();
};

// Create History Buttons
var createHistoryButton = function () {
  // Get the city name out of local storage
  var cityName = JSON.parse(localStorage.getItem("cityItems")) || [];

  // Reset the history wrapper to prevent duplicate buttons
  historyWrapper.innerHTML = "";

  // Create a button for every city in local storage
  for (var i = 0; i < cityName.length; i++) {
    var historyBtn = document.createElement("button");
    historyBtn.className = "historybtn";
    historyBtn.textContent = cityName[i];
    historyBtn.setAttribute("data-city", cityName[i]);
    historyWrapper.appendChild(historyBtn);
  }
};
// Create History Buttons
createHistoryButton();

// Get the five day forcast
var getFiveDayForcast = function (city) {
  // Declare five day URL
  var fiveDayUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
  // Fetch the API URL
  fetch(fiveDayUrl).then(function (response) {
    // If response is in 200's run this code...
    if (response.ok) {
      // Parse response to json format
      response.json().then(function (data) {
        // Run Function
        displayFiveDayForcast(data);
      });
    } else {
      // If response returns in 400's alert user
      alert("Could not find 5-day forcast");
    }
  });
};

// Get current UV index
var getCurrentUvIndex = function (data) {
  // Declare UV API URL
  var uvApiUrl =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    data.coord.lat +
    "&lon=" +
    data.coord.lon +
    "&appid=0938c05e8d987103f9ba5cb07b6b876e";
  // Fetch API URL
  fetch(uvApiUrl).then(function (response) {
    // If response results in 200's run this code...
    if (response.ok) {
      // Parse response to json format
      response.json().then(function (data) {
        // Run function
        displayCurrentUvIndex(data);
      });
    } else {
      // If response results in 400's alert user
      alert("There was a problem fetching UV Index!");
    }
  });
};

// Display Current Weather
var displayCurrentCityWeather = function (data) {
  //Declare varibales for the elments that will be modified in DOM
  var currentCityEl = document.querySelector("#current-city");
  var weatherImg = document.querySelector(".weather-img");
  var tempEl = document.querySelector("#temp");
  var humidityEl = document.querySelector("#humidity");
  var windEl = document.querySelector("#wind");

  // Declare what the curent City is
  var currentCity = data.name;

  // Change the City text to time using day.js
  currentCityEl.textContent =
    currentCity + "    " + dayjs().format("MM/DD/YYYY");

  // Change the weather icon
  weatherImg.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  );

  // Modify the text contents of temp, humidity, and wind speed
  tempEl.textContent = Math.floor(data.main.temp);
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
};

// Display Five day forcast
var displayFiveDayForcast = function (data) {
  // Remove old content
  fiveDayWrapper.textContent = "";

  //Create a for loop that will loop through every 8th index in order to pick the 12pm time for each day. (open weather's 5 day forcast automaticly gives you 5 day future forcast and splits each day to 3 hour time blocks)
  for (var i = 5; i < 38; i += 8) {
    // Create div element for cards
    var fiveDayCard = document.createElement("div");
    fiveDayCard.className = "five-day-card";
    fiveDayWrapper.appendChild(fiveDayCard);

    // Reformat the default time open weather gives us with day.js to cut out the time and use custom date format
    var fiveDayDate = dayjs(data.list[i].dt_txt).format("MM/DD/YYYY");

    // Create date elements
    var fiveDayDates = document.createElement("h3");
    fiveDayDates.className = "five-day-date";
    fiveDayDates.textContent = fiveDayDate;
    fiveDayCard.appendChild(fiveDayDates);

    // Append weather Icon
    var fiveDayImg = document.createElement("img");
    fiveDayImg.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" +
        data.list[i].weather[0].icon +
        "@2x.png"
    );
    fiveDayImg.setAttribute("class", "five-day-img");
    fiveDayCard.appendChild(fiveDayImg);

    // Append Degrees
    var fiveDayTemp = document.createElement("p");
    fiveDayTemp.className = "five-day-temp";
    fiveDayTemp.textContent =
      "Temp: " + Math.floor(data.list[i].main.temp) + " F";
    fiveDayCard.appendChild(fiveDayTemp);

    // Append Humidity
    var fiveDayHumidity = document.createElement("p");
    fiveDayHumidity.className = "five-day-humidity";
    fiveDayHumidity.textContent =
      "Humidity: " + data.list[i].main.humidity + "%";
    fiveDayCard.appendChild(fiveDayHumidity);
  }
};

// Display Current UV Index
var displayCurrentUvIndex = function (data) {
  // Declare UV div
  var uvEl = document.querySelector("#uv");

  // Change the UV's text content to the curent value of the UV
  uvEl.textContent = data.value;

  // Create if else statements to change color of UV Index based on danger
  if (parseInt(uvEl.textContent) <= 2) {
    uvEl.className = "safe-index uv-styles";
  } else if (3 >= parseInt(uvEl.textContent) <= 5) {
    uvEl.className = "moderate-index uv-styles";
  } else if (6 >= parseInt(uvEl.textContent) <= 7) {
    uvEl.className = "high-index uv-styles";
  } else if (8 >= parseInt(uvEl.textContent) <= 10) {
    uvEl.className = "very-high-index uv-styles";
  } else if (parseInt(uvEl.textContent) > 11) {
    uvEl.className = "extreme-index uv-styles";
  }
};

// Event Listeners
formEl.addEventListener("submit", formSubmitHandler);
historyWrapper.addEventListener("click", historyClickHandler);
deleteBtn.addEventListener("click", deleteHistory);

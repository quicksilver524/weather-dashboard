//form variables
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityname");
var stateInputEl = document.querySelector("#statename");
var weatherArray = [];
var c;
//var repoSearchTerm = document.querySelector("#repo-search-term");

//form submission function
var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var cityName = cityInputEl.value.trim();
  var stateName = stateInputEl.value.trim();

  if (!cityName || !stateName) {
    alert("Please enter a city name");
  } else {
    getWeather(40.7, 74);
    cityInputEl.value = "";
    stateInputEl.value = "";
  }
  //console.log(event);
};

var displayWeather = function (cityData) {
  dl = 1;
  if (cityData.daily.length < 11) {
    dl = cityData.daily.length;
  } else {
    dl = 10;
  }
  weatherArray = [];
  for (i = 0; i < dl; i++) {
    var weatherDate = moment().add(i, "d").format("L");
    var temp = cityData.daily[i].temp.day;
    var uvi = cityData.daily[i].uvi;
    var wind = cityData.daily[i].wind_speed;
    var humidity = cityData.daily[i].humidity;
    var iconCode = cityData.daily[i].weather[0].icon;
    var description = cityData.daily[i].weather[0].description;
    //console.log(temp, uvi, wind, humidity, iconCode, description);
    weatherArray[i] = {
      weatherDate,
      temp,
      uvi,
      wind,
      humidity,
      iconCode,
      description,
    };
  }

  // End
  c = 0;
  var day1ContainerArea = document.getElementById("day1-container");
  var day1card = document.createElement("div");
  day1card.classList = "col-auto card card-body";
  day1ContainerArea.innerHTML = "";
  day1ContainerArea.append(day1card);

  var headerEl = document.createElement("h5");
  headerEl.innerHTML = weatherArray[c].weatherDate;
  headerEl.classList = "card-header card-header-date";
  day1card.append(headerEl);

  iconEl = document.createElement("img");
  iconEl.classList = "card-info";
  iconEl.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" + weatherArray[c].iconCode + "@2x.png"
  );
  iconEl.setAttribute("height", "50px");
  iconEl.setAttribute("alt", weatherArray[c].description);
  day1card.append(iconEl);

  //console.log(iconEl);

  var headerSpanEl = document.createElement("span");
  headerSpanEl.innerHTML = " " + weatherArray[c].description;

  headerEl.append(headerSpanEl);

  var cardinfo = document.createElement("div");
  cardinfo.classList = "card-info-body";
  day1card.append(cardinfo);

  var TempEl = document.createElement("p");
  TempEl.innerHTML = "Temperature: " + weatherArray[c].temp + " °F";
  TempEl.classList = "card-info";
  cardinfo.append(TempEl);

  var humidityEl = document.createElement("p");
  humidityEl.innerHTML = "Humidity: " + weatherArray[c].humidity + " %";
  humidityEl.classList = "card-info";
  cardinfo.append(humidityEl);

  var windEl = document.createElement("p");
  windEl.innerHTML = "Wind: " + weatherArray[c].wind + " mph";
  windEl.classList = "card-info";
  cardinfo.append(windEl);

  var uviEl = document.createElement("p");
  uviEl.innerHTML = "Uvi: " + weatherArray[c].uvi;

  var uviColor;
  if (weatherArray[c].uvi < 3) {
    uviColor = "greenuvi";
  } else if (weatherArray[c].uvi < 6) {
    uviColor = "yellowuvi";
  } else if (weatherArray[c].uvi < 8) {
    uviColor = "orangeuvi";
  } else if (weatherArray[c].uvi < 11) {
    uviColor = "reduvi";
  } else {
    uviColor = "purpleuvi";
  }

  uviEl.classList = "card-info " + uviColor;
  cardinfo.append(uviEl);

  //console.log(weatherArray);
};

var getWeather = function (lat, lon) {
  // format the api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=hourly,minutely&appid=6047a3a93fe5b57d52141da0dff7f508";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (cityData) {
          //console.log(cityData);
          displayWeather(cityData);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("api not connect");
    });
};

//submit button
userFormEl.addEventListener("submit", formSubmitHandler);

//display repo content containers
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//display user repos
var displayRepos = function (repos, searchTerm) {
  console.log(repos);
  console.log(searchTerm);
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    // create a link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

var getFeaturedRepos = function (language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: GitHub User Not Found");
    }
  });
};

var languageButtonsE1 = document.querySelector("#language-buttons");

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute("data-language");
  console.log(language);
  if (language) {
    getFeaturedRepos(language);

    // clear old content
    repoContainerEl.textContent = "";
  }
};
languageButtonsE1.addEventListener("click", buttonClickHandler);

function addAbout() {
    let about = document.querySelector("#aboutDiv");
    if (!about) {
        let aboutDiv = document.createElement("div");
        aboutDiv.setAttribute("id", "aboutDiv");
        document.body.appendChild(aboutDiv);
    }

    aboutDiv.innerHTML =
        "<p>Данное приложение предназначено для просмотра прогноза погоды для определённого населённого пункта.</p>" +
        "<p>При помощи радио-кнопок можно выбирать метод отправки данных на сервер.</p>" +
        "<p>Координаты и название населённого пункта определяется определяются при помощи Google API.</p>" +
        "<p>При клике по карте, населённый пункт добавляется в избранное.</p>" +
        "<p>Нужный город можно найти введя название города в строку поиска.</p>" +
        "<p>При клике по названию города в блоке \"История поиска\" или \"Избранное\", выбранный город будет отображаться по центу карты.</p>"
}
let weather = document.querySelector("#weather");

function dragMap() {
    window.location.hash = `/location/${getLatlng()},${myMap.getZoom()}/`;
    addWeather();
}

function addWeather() {
    let myWeather = getForecastByLatLng();
    myWeather
        .then((forecast) => {
            let weatherList = `<ul>Прогноз погоды:
            <li>${forecast.currently.summary}</li>
            <li>Температура: ${Math.round(forecast.currently.temperature)}°C</li>
            <li>Облачность: ${Math.round(forecast.currently.cloudCover * 100)}%</li>
            <li>Влажность: ${Math.round(forecast.currently.humidity * 100)}%</li>
            <li>Скорость ветра: ${forecast.currently.windSpeed}км/ч</li>
            </ul>`;

            weather.innerHTML = weatherList;
        })
}
function addAuthor() {
    let author = document.querySelector("#authorDiv");
    if (!author) {
        let authorDiv = document.createElement("div");
        authorDiv.setAttribute("id", "authorDiv");
        document.body.appendChild(authorDiv);
    }

    authorDiv.innerHTML =
        "<p>Приложение было создано Кулешовым Владимиром Владимировичем.</p>" +
        "<p><a href='https://vk.com/vvkuleshov' target='_blank'>ВКонтакте</a></p>" +
        "<p><a href='https://www.linkedin.com/in/vladimir-kuleshov-27325712a/' target='_blank'>LinkedIn</a></p>" +
        "<p><img src=\"./img/portfolio.jpeg\"></p>"
}
'use strict';
let myMap;

function drawYandexMap (settings, center, zoom = 10) {
    myMap = new ymaps.Map(yandexMap, {
        center: center,
        zoom: zoom
    });
    subscribeToMapEvent();
}

function subscribeToMapEvent() {
    myMap.events.add('click', yandexBalloon);
    myMap.events.add('actionend', dragMap);
    footer.addEventListener('click',clickAtCityName);
    addWeather();
}

function getLatlng(lat, lng) {
    let center;
    if (myMap) {
        center = myMap.getCenter();
    }
    lat = lat || center[0];
    lng = lng || center[1];
    let latlng = lat + "," + lng;
    return latlng;
}
let favorites = document.querySelector("#favorites");

function yandexBalloon(e) {
    if (!myMap.balloon.isOpen()) {
        var coords = e.get('coords');
        getFavoriteCityName(coords);
    }
    else {
        myMap.balloon.close();
    }
}

function getFavoriteCityName(coords) {
    let cityName = getCityName(getLatlng(coords[0], coords[1]));
    cityName
        .then((data) => data.results[1].formatted_address)
        .then((cityName) => {
            myMap.balloon.open(coords, {
                contentBody: `${cityName} добавлен в избранное`,
                contentFooter: '<sup>Щелкните еще раз</sup>'
            });
            return cityName;
        })
        .then((cityName) => addCityToFavorite(cityName));
}

function addCityToFavorite(cityName) {
    let arrayCityName;
    if (!localStorage["favoriteCity"]) {
        localStorage["favoriteCity"] = [];
        arrayCityName = [];
    } else {
        arrayCityName = localStorage["favoriteCity"].split(" ;;");
    }
    if (cityName) {
        arrayCityName.unshift(cityName);
    }
    addFavotiteCityInLocalStorage(arrayCityName);
    addFavoritesAddressList(arrayCityName);
    favorites.addEventListener("click", deleteFavorite);
}

function addFavotiteCityInLocalStorage(arrayCityName) {
    let favoriteCity = "";
    arrayCityName.forEach(function (city) {
        if (city) {
            favoriteCity += city + " ;;";
        }
    })
    localStorage["favoriteCity"] = favoriteCity.slice(0, -3);
}

function addFavoritesAddressList(arrayCityName) {
    let addressList = `<ul>Избранное:`;
    arrayCityName.forEach(function (city, index) {
        addressList += `<li class="favorites">${city}
<span class="deleteFavorite" data-index="${index}">×</span>
</li>`;
    });
    addressList += `</ul>`;

    favorites.innerHTML = addressList;
}

function deleteFavorite(event) {
    let target = event.target;
    let buttonDeleteFavorite = target.matches(".deleteFavorite") && target.closest(".deleteFavorite");
    if (buttonDeleteFavorite) {
        let parentButton = buttonDeleteFavorite.parentElement;
        let dataTask = buttonDeleteFavorite.getAttribute("data-index");
        let cityName = localStorage['favoriteCity'];
        let arrayCityName = cityName.split(' ;;');
        arrayCityName.splice(dataTask, 1);
        addFavotiteCityInLocalStorage(arrayCityName);
        parentButton.remove();
    }
}
let history = document.querySelector("#history");

function addCityToHistory(cityName) {
    let arrayCityName;
    if (!localStorage["searchHistory"]) {
        localStorage["searchHistory"] = [];
        arrayCityName = [];
    } else {
        arrayCityName = localStorage["searchHistory"].split(" ;;");
    }

    if (arrayCityName.length === 5 && cityName) {
        arrayCityName.pop();
    }

    if (cityName) {
        arrayCityName.unshift(cityName);
        weatherRecordInLocalStorage(arrayCityName);
    }
    addHistoryAddressList(arrayCityName);
}

function weatherRecordInLocalStorage(addAddressList) {
    let weatherHistory = "";
    addAddressList.forEach(function (city) {
        weatherHistory += city + " ;;";
    })
    localStorage["searchHistory"] = weatherHistory.slice(0, -3);
}

function addHistoryAddressList(arrayCityName) {
    let addressList = `<ul> История поиска:`;
    arrayCityName.forEach(function (city) {
        addressList += `<li class="history">${city}</li>`
    });
    addressList += `</ul>`;

    history.innerHTML = addressList;
}
function Router(options = []) {
    this.routes = options.routes;
    window.addEventListener("hashchange", () => this.hashCheck(window.location.hash));
    this.hashCheck(window.location.hash);
}

Router.prototype = {
    findNewRoute: function (hash) {
        let route;
        let self = this;
        if (!this.routes) {
            return;
        } else if (this.routes.length === 1) {
            return this.findRoute(hash, this.routes[0]);
        } else {
            this.routes.forEach((routeItem) => {
                if (self.findRoute(hash, routeItem)) {
                    return route = routeItem;
                }
            });
        }
        return route;
    },
    findRoute: function (hash, item) {
        if (typeof item.match === 'string' && hash === item.match ||
            typeof item.match === 'function' && item.match(hash) ||
            item.match instanceof RegExp && hash.match(item.match)) {
            return item;
        }
    },
    hashCheck: function (hash) {
        hash = hash.slice(1);
        let preRoute = this.activeRoute;
        let newRoute = this.findNewRoute(hash);

        if (!newRoute) {
            return;
        } else if (typeof newRoute.match === 'string') {
            this.routeParams = newRoute.match;
        } else if (newRoute.match instanceof RegExp) {
            this.routeParams = hash.match(newRoute.match)[1];
        } else if (typeof newRoute.match === 'function') {
            this.routeParams = newRoute.match(hash);
        }

        Promise.resolve()
            .then(() => {
                if (preRoute && preRoute.onLeave) {
                    this.preRouteParams ? preRoute.onLeave(this.preRouteParams) : preRoute.onLeave()
                }
            })
            .then(() => {
                if (newRoute && newRoute.onBeforeEnter) {
                    this.routeParams ? newRoute.onBeforeEnter(this.routeParams) : newRoute.onBeforeEnter()
                }
            })
            .then(() => {
                if (newRoute && newRoute.onEnter) {
                    this.routeParams ? newRoute.onEnter(this.routeParams) : newRoute.onEnter()
                }
            })
            .then(() => {
                this.activeRoute = newRoute;
                this.preRouteParams = this.routeParams;
            })
            .catch(() => {
            });
    },
};

let router = new Router({
    routes: [{
        name: 'index',
        match: '',
        onBeforeEnter: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "block";
        },
        onEnter: () => {
            let yandexMap = document.querySelector("#yandexMap");
            ymaps.ready(initDrawMap);

            function initDrawMap(event) {
                if (!yandexMap.children.length) {
                    let userLocation = getUserLocation();
                    userLocation
                        .then((location) => {
                            drawYandexMap(event,[location.position.latitude,location.position.longitude]);
                            window.location.hash = `/city/${location.city.name}/`;
                            addCityToHistory();
                            addCityToFavorite();
                        })
                }
            }
        },
        onLeave: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "none";
        }
    }, {
        name: 'About',
        match: 'About',
        onBeforeEnter: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "none";
            let authorDiv = document.querySelector("#authorDiv");
            if (authorDiv) {
                authorDiv.style.display = "none";
            }
        },
        onEnter: () => {
            let aboutDiv = document.querySelector("#aboutDiv");
            if (!aboutDiv) {
                addAbout();
            } else {
                aboutDiv.style.display = "block";
            }
        },
        onLeave: () => {
            let aboutDiv = document.querySelector("#aboutDiv");
            aboutDiv.style.display = "none";
        }
    }, {
        name: 'Author',
        match: 'Author',
        onBeforeEnter: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "none";
            let aboutDiv = document.querySelector("#aboutDiv");
            if (aboutDiv) {
                aboutDiv.style.display = "none";
            }
        },
        onEnter: () => {
            let authorDiv = document.querySelector("#authorDiv");
            if (!authorDiv) {
                addAuthor();
            } else {
                authorDiv.style.display = "block";
            }
        },
        onLeave: () => {
            let authorDiv = document.querySelector("#authorDiv");
            authorDiv.style.display = "none";
        }
    }, {
        name: 'cityName',
        match: /city\/(.+)/,
        onBeforeEnter: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "block";
        },
        onEnter: cityName => {
            let yandexMap = document.querySelector("#yandexMap");
            ymaps.ready(initDrawMap);

            function initDrawMap() {
                if (!yandexMap.children.length) {
                    searchCity(null, cityName.slice(0, -1));
                    addCityToFavorite();
                }
            }
        }
    }, {
        name: 'location',
        match: /location\/(.+)/,
        onBeforeEnter: () => {
            let indexDiv = document.querySelector("#index");
            indexDiv.style.display = "block";
        },
        onEnter: locationMap => {
            let yandexMap = document.querySelector("#yandexMap");
            ymaps.ready(initDrawMap);
            let locationMapArray = locationMap.slice(0, -1).split(",");
            let arrCoords = [locationMapArray[0],locationMapArray[1]];

            function initDrawMap() {
                if (!yandexMap.children.length) {
                    drawYandexMap(event,arrCoords,locationMapArray[2]);
                    addCityToHistory();
                    addCityToFavorite();
                }
            }
        }
    }
]
})
;
let searchInpute = document.querySelector("#search");
let yandexForm = document.querySelector("#yandexForm");

yandexForm.addEventListener("submit", addCityNameToHash)

function addCityNameToHash() {
    let searchCityName = searchCity || searchInpute.value;
    if (searchInpute.value) {
        window.location.hash = `/city/${searchInpute.value}/`;
        searchCity(null,searchInpute.value);
    }
}

function clickAtCityName(event) {
    let target = event.target;
    let targetCityList = target.matches(".favorites") && target.closest(".favorites") ||
        target.matches(".history") && target.closest(".history");
    if (targetCityList) {
        window.location.hash = `/city/${targetCityList.firstChild.data}/`;
        searchCity(event,targetCityList.firstChild.data);
    }
}

function searchCity(event,searchCity) {
    let getLocation = getCoords(searchCity);
    getLocation
        .then((data) => {
            addCityToHistory(data.results[0].formatted_address);
            return data;
        })
        .then((data) => data.results[0].geometry.location)
        .then((coords) => {
            let arrCoords = [];
            arrCoords[0] = coords.lat;
            arrCoords[1] = coords.lng;
            return arrCoords;
        })
        .then((arrCoords) => {
            let latlng = getLatlng(arrCoords[0], arrCoords[1]);
            yandexMap.innerHTML = "";
            drawYandexMap(event, arrCoords);
            getForecastByLatLng(event, latlng);
        });
}
let fetchMethod = document.querySelector("#fetchMethod");
let XHRMethod = document.querySelector("#XHRMethod");

function getForecastByLatLng(event, latlng) {
    latlng = latlng || getLatlng();
    let DARKSKY_API_KEY = `e2fdce61fddd3b7c2bcc0ab7ac25536c`;
    let url = `https://free-cors-proxy.herokuapp.com/https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latlng}?lang=ru%26units=si`
    if (fetchMethod.checked) {
        return getFetch(url);
    } else if (XHRMethod.checked) {
        return getXHR(url);
    }
}

function getCityName(latlng) {
    let GOOGLE_API_KEY = `AIzaSyBbt9DGHAlhJIrltRyAXpJ6d8E1RDvANAQ`;
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${GOOGLE_API_KEY}&language=ru`;
    if (fetchMethod.checked) {
        return getFetch(url);
    } else if (XHRMethod.checked) {
        return getXHR(url);
    }
}

function getCoords(addr) {
    let GOOGLE_API_KEY = `AIzaSyBbt9DGHAlhJIrltRyAXpJ6d8E1RDvANAQ`;
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=${GOOGLE_API_KEY}&language=ru`;
    if (fetchMethod.checked) {
        return getFetch(url);
    } else if (XHRMethod.checked) {
        return getXHR(url);
    }
}

function getUserLocation(addr) {
    let url = `https://api.userinfo.io/userinfos`;
    if (fetchMethod.checked) {
        return getFetch(url);
    } else if (XHRMethod.checked) {
        return getXHR(url);
    }
}

function getFetch(url) {
    return fetch(url)
        .then((request) => request.json())
        .catch(error => {
            console.log(error);
        });
}

function getXHR(url) {
    return new Promise(function(resolve, reject) {
        let cityNameXHR = new XMLHttpRequest();
        cityNameXHR.open('GET', url, true);
        cityNameXHR.onload = () => {
            if (cityNameXHR.status == 200) {
                resolve(JSON.parse(cityNameXHR.response));
            } else {
                let error = new Error(cityNameXHR.statusText);
                error.code = cityNameXHR.status;
                reject(error);
            }
        };
        cityNameXHR.onerror = () => console.log(error);
        cityNameXHR.send();
    });
}
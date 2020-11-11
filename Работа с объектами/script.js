"use strict";

(function () {
    /* Создайте массив объектов-стран. У страны есть название и список городов.
    У города есть название и численность населения */
    var russia = {
        name: "Россия",
        cities: [
            {cityName: "Москва", population: 12678079},
            {cityName: "Санкт-Петербург", population: 5398064},
            {cityName: "Новосибирск", population: 1625631},
            {cityName: "Екатеринбург", population: 1493749},
            {cityName: "Владивосток", population: 606561}
        ]
    }

    var germany = {
        name: "Германия",
        cities: [
            {cityName: "Берлин", population: 12678079},
            {cityName: "Гамбург", population: 5398064},
            {cityName: "Мюнхен", population: 1625631},
            {cityName: "Кёльн", population: 1625631}
        ]
    }

    var france = {
        name: "Франция",
        cities: [
            {cityName: "Париж", population: 2138551},
            {cityName: "Марсель", population: 794811},
            {cityName: "Лион", population: 472317},
            {cityName: "Тулуза", population: 433055},
            {cityName: "Ницца", population: 338620}
        ]
    }

    var countries = [russia, germany, france];
    console.log("Создали массив объектов-стран:");
    console.log(countries);

    // Найдите страну/страны с максимальным количеством городов
    var countriesWithCitiesMaxCount = [];
    var citiesMaxCount = 0;

    countries.forEach(function (country) {
        if (country.cities.length > citiesMaxCount) {
            citiesMaxCount = country.cities.length;
            countriesWithCitiesMaxCount = [];
            countriesWithCitiesMaxCount.push(country.name);
        } else if (country.cities.length === citiesMaxCount) {
            countriesWithCitiesMaxCount.push(country.name);
        }
    });

    console.log("Нашли страну/страны с максимальным количеством городов:");
    console.log(countriesWithCitiesMaxCount);

    /* Получите объект с информацией по всем странам такого вида: ключ - название страны, значение - суммарная
    численность по стране */
    var totalPopulationByCountries = {};

    countries.forEach(function (country) {
        totalPopulationByCountries[country.name] = country.cities.reduce(function (totalPopulation, city) {
            return totalPopulation + city.population;
        }, 0);
    });

    console.log("Получили объект с информацией по странам (ключ - название страны, значение - численность населения):");
    console.log(totalPopulationByCountries);
})();
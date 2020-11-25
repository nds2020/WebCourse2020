"use strict";

(function () {
    /* Создайте массив объектов-стран. У страны есть название и список городов.
    У города есть название и численность населения */
    var countries = [
        {
            name: "Россия",
            cities: [
                {
                    name: "Москва",
                    population: 12678079
                },
                {
                    name: "Санкт-Петербург",
                    population: 5398064
                },
                {
                    name: "Новосибирск",
                    population: 1625631
                },
                {
                    name: "Екатеринбург",
                    population: 1493749
                },
                {
                    name: "Владивосток",
                    population: 606561
                }
            ]
        },
        {
            name: "Германия",
            cities: [
                {
                    name: "Берлин",
                    population: 12678079
                },
                {
                    name: "Гамбург",
                    population: 5398064
                },
                {
                    name: "Мюнхен",
                    population: 1625631
                },
                {
                    name: "Кёльн",
                    population: 1625631
                }
            ]
        },
        {
            name: "Франция",
            cities: [
                {
                    name: "Париж",
                    population: 2138551
                },
                {
                    name: "Марсель",
                    population: 794811
                },
                {
                    name: "Лион",
                    population: 472317
                },
                {
                    name: "Тулуза",
                    population: 433055
                },
                {
                    name: "Ницца",
                    population: 338620
                }
            ]
        }
    ];

    console.log("Создали массив объектов-стран:");
    console.log(countries);

    // Найдите страну/страны с максимальным количеством городов
    function getCountriesWithMaxCitiesCount() {
        var array = [];
        var maxCitiesCount = 0;

        countries.forEach(function (country) {
            if (country.cities.length > maxCitiesCount) {
                maxCitiesCount = country.cities.length;
                array = [country];
            } else if (country.cities.length === maxCitiesCount) {
                array.push(country);
            }
        });

        return array;
    }

    console.log("Нашли страну/страны с максимальным количеством городов:");
    console.log(getCountriesWithMaxCitiesCount());

    /* Получите объект с информацией по всем странам такого вида: ключ - название страны, значение - суммарная
    численность по стране */
    function getTotalPopulationByCountries() {
        var object = {};

        countries.forEach(function (country) {
            object[country.name] = country.cities.reduce(function (totalPopulation, city) {
                return totalPopulation + city.population;
            }, 0);
        });

        return object;
    }

    console.log("Получили объект с информацией по странам (ключ - название страны, значение - численность населения):");
    console.log(getTotalPopulationByCountries());
})();
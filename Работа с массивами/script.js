"use strict";

(function () {
    // Создайте массив чисел
    var array = [3, 5, 8, 12, 1, 4, 2, 15, 10, 4];

    console.log("Исходный массив:");
    console.log(array);

    // Отсортируйте его по убыванию
    array.sort(function (e1, e2) {
        return e2 - e1;
    });

    console.log("Отсортировали его по убыванию:");
    console.log(array);

    // Получите подмассив из первых 5 элементов и подмассив из послених 5 элементов
    var firstFiveElementsArray = array.slice(0, 5);
    console.log("Получили подмассив из первых 5 элементов:");
    console.log(firstFiveElementsArray);

    var lastFiveElementsArray = array.slice(array.length - 5);
    console.log("Получили подмассив из последних 5 элементов:");
    console.log(lastFiveElementsArray);

    // Найдите сумму элементов массива, которые являются четными числами
    var evenNumbersSum = array
        .filter(function (number) {
            return number % 2 === 0;
        })
        .reduce(function (memo, number) {
            return memo + number;
        }, 0);

    console.log("Сумма четных элементов исходного массива = " + evenNumbersSum);

    // Создайте массив чисел от 1 до 100 в таком порядке
    var bigArray = [];

    for (var i = 1; i <= 100; ++i) {
        bigArray.push(i);
    }

    console.log("Создали массив чисел от 1 до 100:");
    console.log(bigArray);

    // Получите список квадратов четных чисел из этого массива
    var evenNumbersSquaresArray = bigArray
        .filter(function (number) {
            return number % 2 === 0;
        })
        .map(function (number) {
            return number * number;
        });

    console.log("Получили список квадратов четных чисел этого массива:");
    console.log(evenNumbersSquaresArray);
})();
"use strict";

(function () {
    var list = [
        {
            age: 34,
            name: "Дмитрий",
            lastName: "Никитин"
        },
        {
            age: 28,
            name: "Ольга",
            lastName: "Соломина"
        },
        {
            age: 33,
            name: "Лев",
            lastName: "Володькин"
        },
        {
            age: 25,
            name: "Елена",
            lastName: "Вакуленко"
        },
        {
            age: 36,
            name: "Александр",
            lastName: "Музыка"
        },
        {
            age: 41,
            name: "Олег",
            lastName: "Поздняк"
        },
        {
            age: 39,
            name: "Наталья",
            lastName: "Леонова"
        },
        {
            age: 80,
            name: "Алла",
            lastName: "Исакова"
        },
        {
            age: 5,
            name: "Артём",
            lastName: "Никитин"
        },
        {
            age: 20,
            name: "Полина",
            lastName: "Кольчикова"
        }
    ];

    // Посчитать средний возраст всех людей
    var averageAge = _.reduce(list, function (memo, person) { return memo + person.age; }, 0) / _.size(list);

    console.log("Средний возраст людей равен " + averageAge);

    // Получить список людей с возрастом от 20 до 30 включительно, отсортировать их по возрастанию возраста
    var peoplesFrom20To30YearsOld = _.chain(list)
        .filter(function (person) { return person.age >= 20 && person.age <= 30; })
        .sortBy("age")
        .value();

    console.log("Получили список людей с возрастом от 20 до 30 лет и отсортировали их по возрастанию возраста:")
    console.log(peoplesFrom20To30YearsOld);

    // Добавить всем людям поле fullName, которое состоит из фамилии и имени через пробел
    _.each(list, function (person) { person.fullName = person.lastName + " " + person.name; });

    console.log("Добавили всем людям поле fullName (фамилия и имя через пробел):")
    console.log(list);
})();
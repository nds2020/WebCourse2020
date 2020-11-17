"use strict";

document.addEventListener("DOMContentLoaded", function (e) {
    var errorMessage = document.getElementById("error-message");
    var nondisplayedElements = document.querySelectorAll("#celsius-degree ~ div");
    var celsiusDegreeInputField = document.getElementById("celsius-degree-input-field");
    var convertButton = document.getElementById("convert-button");
    var сonvertButtonInitialContent = convertButton.textContent;

    convertButton.addEventListener("click", function (e) {
        if (isNaN(celsiusDegreeInputField.value) || celsiusDegreeInputField.value === "") {
            errorMessage.style.visibility = "visible";
            return;
        }

        if (convertButton.textContent === сonvertButtonInitialContent) {
            [].forEach.call(nondisplayedElements, function (e) {
                e.style.display = "inline-block";
            });

            document.getElementById("fahrenheit-degree-input-field").value = (celsiusDegreeInputField.value * 9 / 5 + 32).toFixed(2);
            document.getElementById("kelvin-input-field").value = (+celsiusDegreeInputField.value + 273.15).toFixed(2);
            celsiusDegreeInputField.setAttribute("readonly", "readonly");
            convertButton.textContent = "Ввести другое значение";
            errorMessage.style.visibility = "hidden";
        } else {
            [].forEach.call(nondisplayedElements, function (e) {
                e.style.display = "none"
            });

            celsiusDegreeInputField.removeAttribute("readonly");
            celsiusDegreeInputField.value = "";
            convertButton.textContent = сonvertButtonInitialContent;
        }
    });

    /* Для решения 2 проблем при фокусе поля ввода:
       1. курсор появляется в центре поля ввода в Edge (для поля задано CSS-свойство text-align: center),
       2. во всех браузерах исчезает текст placeholder'а. */
    celsiusDegreeInputField.addEventListener("focus", function (e) {
        celsiusDegreeInputField.removeAttribute("placeholder");
    });

    celsiusDegreeInputField.addEventListener("blur", function (e) {
        celsiusDegreeInputField.setAttribute("placeholder", "Введите значение");
    });
});
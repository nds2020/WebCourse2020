"use strict";

document.addEventListener("DOMContentLoaded", function () {
    var errorMessage = document.getElementById("error-message");
    var hiddenElements = document.querySelectorAll("#celsius-degree ~ div");
    var celsiusDegreeInputField = document.getElementById("celsius-degree-input-field");
    var convertButton = document.getElementById("convert-button");
    var initialConvertButtonContent = convertButton.textContent;

    convertButton.addEventListener("click", function () {
        if (isNaN(celsiusDegreeInputField.value) || celsiusDegreeInputField.value === "") {
            errorMessage.style.visibility = "visible";
            return;
        }

        if (convertButton.textContent === initialConvertButtonContent) {
            [].forEach.call(hiddenElements, function (e) {
                e.style.display = "inline-block";
            });

            document.getElementById("fahrenheit-degree-input-field").value = (celsiusDegreeInputField.value * 9 / 5 + 32).toFixed(2);
            document.getElementById("kelvin-input-field").value = (+celsiusDegreeInputField.value + 273.15).toFixed(2);
            celsiusDegreeInputField.setAttribute("readonly", "readonly");
            convertButton.textContent = "Ввести другое значение";
            errorMessage.style.visibility = "hidden";
        } else {
            [].forEach.call(hiddenElements, function (e) {
                e.style.display = "none"
            });

            celsiusDegreeInputField.removeAttribute("readonly");
            celsiusDegreeInputField.value = "";
            convertButton.textContent = initialConvertButtonContent;
        }
    });
});
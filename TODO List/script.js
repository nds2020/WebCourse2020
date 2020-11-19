"use strict";

document.addEventListener("DOMContentLoaded", function (e) {
    var inputTextArea = document.getElementById("task-input-textarea");
    var errorMessage = document.getElementById("error-message");

    document.getElementById("add-button").addEventListener("click", function (e) {
        if (inputTextArea.value.trim().length === 0) {
            errorMessage.style.visibility = "visible";
            inputTextArea.value = ""; // чтобы область очищалась, даже если ввели только пробелы.
            return;
        }

        errorMessage.style.visibility = "hidden";

        var taskText = inputTextArea.value;

        var task = document.createElement("div");
        task.setAttribute("class", "task");

        function setTask() {
            task.innerHTML =
                "<div class='text-section'><ul><li class='text'></li></ul></div>" +
                "<div class='buttons-section'><button class='button edit-button' type='button'>Изменить</button>" +
                "<button class='button delete-button' type='button'>Удалить</button></div>";
            task.querySelector(".text").textContent = taskText;

            task.querySelector(".delete-button").addEventListener("click", function (e) {
                if (confirm("Вы уверены, что хотите удалить задание?")) {
                    task.parentNode.removeChild(task);
                }
            });

            task.querySelector(".edit-button").addEventListener("click", function (e) {
                task.querySelector(".text-section").innerHTML = "<textarea class='editable-task-textarea' rows='4'></textarea>";
                task.querySelector(".buttons-section").innerHTML = "<button class='button save-button' type='button'>Сохранить</button>" +
                    "<button class='button cancel-button' type='button'>Отменить</button>";
                task.querySelector(".editable-task-textarea").value = taskText;

                task.querySelector(".save-button").addEventListener("click", function (e) {
                    if (task.querySelector(".editable-task-textarea").value.trim().length === 0) {
                        if (confirm("У задания нет текста. Удалить его?")) {
                            task.parentNode.removeChild(task);
                        }

                        return;
                    }

                    taskText = task.querySelector(".editable-task-textarea").value;
                    setTask();
                });

                task.querySelector(".cancel-button").addEventListener("click", function (e) {
                    if (confirm("Вы уверены, что хотите отменить внесенные изменения?")) {
                        setTask();
                    }
                });
            });
        };

        setTask();
        document.getElementById("tasks-container").appendChild(task);
        inputTextArea.value = "";
    });

    document.getElementById("clear-button").addEventListener("click", function (e) {
        if (inputTextArea.value.length !== 0) {
            if (confirm("Вы уверены, что хотите удалить введенный текст?")) {
                inputTextArea.value = "";
            }
        }
    });
});
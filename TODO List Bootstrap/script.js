"use strict";

$(document).ready(function () {
    var inputTextArea = $("#task-input-textarea");
    var errorMessage = $("#error-message");
    var dialog = $("#dialog");
    var dialogContent = $("#dialog-content");
    var dialogYesButton = $("#modal-dialog-yes-button");

    $("#add-button").click(function () {
        var taskText = inputTextArea.val();

        if ($.trim(taskText).length === 0) {
            errorMessage.removeClass("invisible");
            inputTextArea.val("");
            return;
        }

        errorMessage.addClass("invisible");

        var task = $("<div class='task row pl-3 pr-3 mb-3'></div>");

        function setTask() {
            task.html(
                "<div class='text-section col pl-0 pr-2 mb-3'><ul><li class='text text-break text-justify'</li></ul></div>" +
                "<div class='buttons-section col-xs-3'>" +
                "<button type='button' class='btn btn-primary btn-block btn-sm edit-button font-weight-bold'>Изменить</button>" +
                "<button type='button' class='btn btn-danger btn-block btn-sm delete-button font-weight-bold'>Удалить</button></div>"
            );
            task.find(".text").text(taskText);

            task.find(".delete-button").click(function () {
                dialogContent.text("Вы уверены, что хотите удалить задание?");
                dialog.modal("show");

                dialogYesButton.click(function () {
                    task.remove();
                    dialog.modal("hide");
                });
            });

            task.find(".edit-button").click(function () {
                task.find(".text-section").html("<textarea class='task-textarea form-control' rows='4'></textarea>");
                task.find(".buttons-section").html(
                    "<button type='button' class='btn btn-success btn-block btn-sm save-button font-weight-bold'>Сохранить</button>" +
                    "<button type='button' class='btn btn-danger btn-block btn-sm cancel-button font-weight-bold'>Отменить</button>"
                );
                var taskTextArea = task.find(".task-textarea");
                taskTextArea.val(taskText);

                task.find(".save-button").click(function () {
                    if ($.trim(taskTextArea.val()).length === 0) {
                        dialogContent.text("У задания нет текста. Удалить его?");
                        dialog.modal("show");

                        dialogYesButton.click(function () {
                            task.remove();
                            dialog.modal("hide");
                        });

                        return;
                    }

                    taskText = taskTextArea.val();
                    setTask();
                });

                task.find(".cancel-button").click(function () {
                    dialogContent.text("Вы уверены, что хотите отменить внесенные изменения?");
                    dialog.modal("show");

                    dialogYesButton.click(function () {
                        setTask();
                        dialog.modal("hide");
                    });
                });
            });
        }

        setTask();
        $("#tasks-container").append(task);
        inputTextArea.val("");
    });

    $("#clear-button").click(function () {
        if (inputTextArea.val().length !== 0) {
            dialogContent.text("Вы уверены, что хотите удалить введенный текст?");
            dialog.modal("show");

            dialogYesButton.click(function () {
                inputTextArea.val("");
                dialog.modal("hide");
            });
        }
    });
});
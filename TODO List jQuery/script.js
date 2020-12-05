"use strict";

$(document).ready(function () {
    var confirmDialog = $("#confirm-dialog")
        .dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true
        })
        .dialog("close");

    var confirmDialogMessageTag = confirmDialog.find("p");
    var inputTextArea = $("#task-input-textarea");
    var errorMessage = $("#error-message");

    $("#add-button").click(function () {
        var taskText = inputTextArea.val();

        if ($.trim(taskText).length === 0) {
            errorMessage.removeClass("hidden");
            inputTextArea.val("");
            return;
        }

        errorMessage.addClass("hidden");

        var task = $("<div class='task'></div>");

        function setTask() {
            task.html(
                "<div class='text-section'><ul><li class='text'></li></ul></div>" +
                "<div class='buttons-section'><button class='button edit-button' type='button'>Изменить</button>" +
                "<button class='button delete-button' type='button'>Удалить</button></div>"
            );
            task.find(".text").text(taskText);

            task.find(".delete-button").click(function () {
                confirmDialogMessageTag.text("Вы уверены, что хотите удалить задание?");
                confirmDialog.dialog({
                    buttons: {
                        "Да": function () {
                            task.remove();
                            $(this).dialog("close");
                        },
                        "Нет": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });

            task.find(".edit-button").click(function () {
                task.find(".text-section").html("<textarea class='editable-task-textarea' rows='4'></textarea>");
                task.find(".buttons-section").html(
                    "<button class='button save-button' type='button'>Сохранить</button>" +
                    "<button class='button cancel-button' type='button'>Отменить</button>"
                );
                task.find(".editable-task-textarea").val(taskText);

                task.find(".save-button").click(function () {
                    if ($.trim(task.find(".editable-task-textarea").val()).length === 0) {
                        confirmDialogMessageTag.text("У задания нет текста. Удалить его?");
                        confirmDialog.dialog({
                            buttons: {
                                "Да": function () {
                                    task.remove();
                                    $(this).dialog("close");
                                },
                                "Нет": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });

                        return;
                    }

                    taskText = task.find(".editable-task-textarea").val();
                    setTask();
                });

                task.find(".cancel-button").click(function () {
                    confirmDialogMessageTag.text("Вы уверены, что хотите отменить внесенные изменения?");
                    confirmDialog.dialog({
                        buttons: {
                            "Да": function () {
                                setTask();
                                $(this).dialog("close");
                            },
                            "Нет": function () {
                                $(this).dialog("close");
                            }
                        }
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
            confirmDialogMessageTag.text("Вы уверены, что хотите удалить введенный текст?");
            confirmDialog.dialog({
                buttons: {
                    "Да": function () {
                        inputTextArea.val("");
                        $(this).dialog("close");
                    },
                    "Нет": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    });
});
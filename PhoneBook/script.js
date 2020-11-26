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

    var phonesInBook = [];
    var lastNameField = $("#last-name-field");
    var firstNameField = $("#first-name-field");
    var phoneField = $("#phone-field");

    $("#add-button").click(function () {
        //Проверяем, что заполнены все поля формы
        var hasEmptyField = false;

        $(".input-field").not("#filter-input-field").each(function (field) {
            field = $(this);

            if ($.trim(field.val()).length === 0) {
                field.css("border", "1px solid #f00");
                field.parent().next().css("visibility", "visible").text("*Поле должно быть заполнено");
                hasEmptyField = true;
            } else {
                field.css("border", "1px solid #000");
                field.parent().next().css("visibility", "hidden");
            }
        });

        if (hasEmptyField) {
            return;
        }

        // Проверяем, есть ли контакт с указанным номером телефона в книге
        var newPhone = phoneField.val();

        if ($.inArray(newPhone, phonesInBook) >= 0) {
            phoneField.css("border", "1px solid #f00");
            $("#phone-field-error").text("*Контакт с номером телефона " + newPhone + " уже есть в книге").css("visibility", "visible");
            return;
        }

        // Если все проверки пройдены успешно, то добавляем контакт в книгу
        phonesInBook.push(newPhone);

        var entry = $("<tr></tr>")
            .html("<td><input type='checkbox' class='checkbox'></td>" +
                "<td class='entry-number'></td>" +
                "<td class='last-name'></td>" +
                "<td class='first-name'></td>" +
                "<td class='phone'></td>" +
                "<td><button type='button' class='delete-button'>X</button></td>")
            .appendTo($(".table tbody"));

        entry.find(".last-name").text(lastNameField.val());
        entry.find(".first-name").text(firstNameField.val());
        entry.find(".phone").text(newPhone);

        entry.find(".delete-button").click(function () {
            confirmDialog.find("p").text("Вы уверены, что хотите удалить контакт?");
            confirmDialog.dialog({
                buttons: {
                    "yes": function () {
                        phonesInBook.splice(phonesInBook.indexOf(newPhone), 1);
                        entry.remove();
                        $(this).dialog("close");
                    },
                    "no": function () {
                        $(this).dialog("close");
                    }
                }
            });
        });

        lastNameField.val("");
        firstNameField.val("");
        phoneField.val("");

        /* Обработка чек-бокса в шапке таблицы (если его выбирают, то выбираются чек-боксы всех строк таблицы,
        eсли его убирают, то очищается выбор всех строк) */
        $("#thead-checkbox").click(function () {
            var tableCheckboxes = $(".table tbody tr:not(:hidden) .checkbox");

            if ($(this).is(":checked")) {
                tableCheckboxes.prop("checked", true);
            } else {
                tableCheckboxes.prop("checked", false);
            }
        });

        // Обработка кнопки удаления всех выбранных строк
        $("#thead-delete-button").click(function () {
            var checkedEntries = $(".table tbody tr:has(:checked)");

            if (checkedEntries.length !== 0) {
                confirmDialog.find("p").text("Вы уверены, что хотите удалить выбранные контакты?");
                confirmDialog.dialog({
                    buttons: {
                        "yes": function () {
                            checkedEntries.find(".phone").each(function (cell) {
                                cell = $(this);
                                phonesInBook.splice(phonesInBook.indexOf(cell.text()), 1);
                            });
                            checkedEntries.remove();
                            $("#thead-checkbox").prop("checked", false);
                            $(this).dialog("close");
                        },
                        "no": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
        });

        // Обработка кнопок фильтра
        $("#apply-button").click(function () {
            var filterText = $("#filter-input-field").val().toLowerCase();
            var entries = $(".table tbody tr");

            entries.hide();

            $(".last-name, .first-name, .phone").each(function (cell) {
                cell = $(this);

                if (cell.text().toLowerCase().indexOf(filterText) >= 0) {
                    cell.parent().show();
                }
            });

            $("#reset-button").click(function () {
                entries.show();
                $("#filter-input-field").val("");
            });
        });
    });
});
Vue.component("modal", {
    template: "#modal-template",

    data: function () {
        return {
            onYesFunction: null
        }
    },

    methods: {
        show: function (someFunction) {
            this.onYesFunction = someFunction;
            $(this.$refs.confirmDialogTemplate).modal("show");
        },

        clickYes: function () {
            this.onYesFunction();
            $(this.$refs.confirmDialogTemplate).modal("hide");
        }
    }
});

new Vue({
    el: "#app",
    data: {
        items: [],
        newTodoText: "",
        newId: 1,
        hasInputText: true,
        confirmDialogTitleText: "",
        confirmDialogBodyText: ""
    },

    methods: {
        addNewTodoItem: function () {
            var text = this.newTodoText;

            if (text.trim().length === 0) {
                this.hasInputText = false;
                this.newTodoText = "";
                return;
            }

            this.items.push({
                id: this.newId,
                text: text,
                isEditing: false,
                editText: text
            });

            this.hasInputText = true;
            this.newTodoText = "";
            this.newId++;
        },

        deleteItem: function (itemForDelete, confirmDialogTitleText, confirmDialogBodyText) {
            this.confirmDialogTitleText = confirmDialogTitleText || "Удаление задания";
            this.confirmDialogBodyText = confirmDialogBodyText || "Вы уверены, что хотите удалить задание?";

            var self = this;
            this.$refs.confirmDialog.show(function () {
                self.items = self.items.filter(function (item) {
                    return item !== itemForDelete;
                });
            });
        },

        clearInputText: function () {
            if (this.newTodoText !== "") {
                this.confirmDialogTitleText = "Отмена ввода";
                this.confirmDialogBodyText = "Вы уверены, что хотите удалить введенный текст?";

                var self = this;
                this.$refs.confirmDialog.show(function () {
                    self.newTodoText = "";
                });
            }
        },

        editItem: function (item) {
            item.isEditing = true;
        },

        saveItemChanges: function (item) {
            if (item.editText.trim().length === 0) {
                this.deleteItem(item, "Пустое задание", "У задания нет текста. Удалить его?");
                return;
            }

            item.text = item.editText;
            item.isEditing = false;
        },

        cancelItemChanges: function (item) {
            if (item.editText !== item.text) {
                this.confirmDialogTitleText = "Отмена изменений";
                this.confirmDialogBodyText = "Вы уверены, что хотите отменить внесенные изменения?";

                this.$refs.confirmDialog.show(function () {
                    item.editText = item.text;
                    item.isEditing = false;
                });
            }
        }
    }
});
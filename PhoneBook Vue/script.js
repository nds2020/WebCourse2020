Vue.component("confirm-dialog", {
    template: "#confirm-dialog-template",

    data: function () {
        return {
            onYesFunction: null,
            confirmDialogTitleText: "",
            confirmDialogBodyText: ""
        }
    },

    methods: {
        prepare: function (functionOnYesButton, confirmDialogTitleText, confirmDialogBodyText) {
            this.onYesFunction = functionOnYesButton;
            this.confirmDialogTitleText = confirmDialogTitleText;
            this.confirmDialogBodyText = confirmDialogBodyText;
        },

        show: function () {
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
        contacts: [],
        newId: 1,
        newLastName: null,
        newFirstName: null,
        newPhone: null,
        filterText: ""
    },

    computed: {
        /* Решил попробовать сделать так, чтобы:
           1. При нажатии на чекбокс в шапке таблицы ставилась/снималась отметка с чекбоков всех строк
           2. При ручном выборе всех строк, выбирался чекбокс шапки
           3. Чтобы 2 пункт работал и на отфильтрованных строках (при выборе всех отфильтрованных - выбирался чекбокс в шапке,
           при сбросе фильтра - чекбокс в шапке снимался (т.к. выбранными становятся не все строки)*/
        checkedTheadCheckbox: {
            get: function () {
                var filteredContacts = this.contacts.filter(function (contact) {
                    return contact.displayed;
                });

                return (
                    filteredContacts.length > 0
                    &&
                    filteredContacts.every(function (contact) {
                        return contact.checked;
                    })
                )
            },

            set: function (checked) {
                this.contacts.forEach(function (contact) {
                    if (contact.displayed) {
                        contact.checked = checked;
                    }
                });
            }
        },

        newPhoneErrorText: function () {
            return this.hasSuchPhone ? "*Контакт с указанным номером телефона уже есть в таблице" : "*Необходимо ввести телефон";
        },

        hasSuchPhone: function () {
            var self = this;
            return this.contacts.some(function (contact) {
                return contact.phone === self.newPhone;
            });
        }
    },

    methods: {
        addNewContact: function () {
            this.newLastName = this.newLastName || "";
            this.newFirstName = this.newFirstName || "";
            this.newPhone = this.newPhone || "";

            // если какое-то поле формы пустое либо указанный телефон уже есть в таблице, то не добавляем контакт
            if (!this.newLastName || !this.newFirstName || !this.newPhone || this.hasSuchPhone) {
                return;
            }

            // если все проверки пройдены успешно, то добавляем контакт в таблицу
            this.contacts.push({
                id: this.newId,
                lastName: this.newLastName,
                firstName: this.newFirstName,
                phone: this.newPhone,
                checked: false,
                displayed: true
            });

            this.newLastName = null;
            this.newFirstName = null;
            this.newPhone = null;
            this.newId++;
        },

        clearInputData: function () {
            if (this.newLastName || this.newFirstName || this.newPhone) {
                var self = this;
                this.$refs.confirmDialog.prepare(function () {
                    self.newLastName = null;
                    self.newFirstName = null;
                    self.newPhone = null;
                }, "Отмена ввода", "Вы уверены, что хотите удалить введенные данные?");
                this.$refs.confirmDialog.show();
            }
        },

        deleteContact: function (contactForDelete) {
            var self = this;
            this.$refs.confirmDialog.prepare(function () {
                self.contacts = self.contacts.filter(function (contact) {
                    return contact !== contactForDelete;
                });
            }, "Удаление контакта", "Вы уверены, что хотите удалить контакт?");
            this.$refs.confirmDialog.show();
        },

        deleteCheckedContacts: function () {
            if (this.contacts.some(function (contact) {
                return contact.checked;
            })) {
                var self = this;
                this.$refs.confirmDialog.prepare(function () {
                    self.contacts = self.contacts.filter(function (contact) {
                        return contact.checked !== true;
                    });
                }, "Удаление контактов", "Вы уверены, что хотите удалить отмеченные контакты?");
                this.$refs.confirmDialog.show();
            }
        },

        applyFilter: function () {
            var filterText = this.filterText.toLowerCase();

            this.contacts.forEach(function (contact) {
                if (contact.lastName.toLowerCase().indexOf(filterText) === -1 &&
                    contact.firstName.toLowerCase().indexOf(filterText) === -1 &&
                    contact.phone.toLowerCase().indexOf(filterText) === -1) {
                    contact.displayed = false;
                    contact.checked = false;
                } else {
                    // чтобы не нажимать кнопку "Сбросить", если хотим, чтобы после удаления символа(ов)
                    // в поле фильтра и повторной фильтрации отобразились ранее скрытые контакты, если
                    // они удовлетворяют фильтру.
                    contact.displayed = true;
                }
            });
        },

        resetFilter: function () {
            this.contacts.forEach(function (contact) {
                contact.displayed = true;
            });

            this.filterText = "";
        }
    }
});
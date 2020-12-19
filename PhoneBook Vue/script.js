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
        contacts: [],
        newId: 1,
        newLastName: "",
        newFirstName: "",
        newPhone: "",
        hasLastName: true,
        hasFirstName: true,
        hasPhone: true,
        newPhoneErrorText: "",
        confirmDialogTitleText: "",
        confirmDialogBodyText: "",
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

            set: function (boolean) {
                this.contacts.forEach(function (contact) {
                    if (contact.displayed) {
                        contact.checked = boolean;
                    }
                });
            }
        }
    },

    methods: {
        addNewContact: function () {
            // поверяем, что все поля формы заполнены
            this.hasLastName = this.newLastName ? true : false;
            this.hasFirstName = this.newFirstName ? true : false;
            this.newPhoneErrorText = (this.hasPhone = this.newPhone ? true : false) ? "" : "*Необходимо ввести телефон";

            if (!this.hasLastName || !this.hasFirstName || !this.hasPhone) {
                return;
            }

            // провеяем, что в таблице нет контакта с указанным телефоном
            var self = this;

            if (this.contacts.some(function (contact) {
                return contact.phone === self.newPhone;
            })) {
                this.hasPhone = false;
                this.newPhoneErrorText = "*Контакт с указанным номером телефона уже есть в таблице";
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

            this.newLastName = "";
            this.newFirstName = "";
            this.newPhone = "";
            this.newId++;
        },

        clearInputData: function () {
            if (this.newLastName || this.newFirstName || this.newPhone) {
                this.confirmDialogTitleText = "Отмена ввода";
                this.confirmDialogBodyText = "Вы уверены, что хотите удалить введенные данные?";

                var self = this;
                this.$refs.confirmDialog.show(function () {
                    self.newLastName = "";
                    self.newFirstName = "";
                    self.newPhone = "";
                    self.hasLastName = true;
                    self.hasFirstName = true;
                    self.hasPhone = true;
                });
            }
        },

        deleteContact: function (contactForDelete) {
            this.confirmDialogTitleText = "Удаление контакта";
            this.confirmDialogBodyText = "Вы уверены, что хотите удалить контакт?";

            var self = this;
            this.$refs.confirmDialog.show(function () {
                self.contacts = self.contacts.filter(function (contact) {
                    return contact !== contactForDelete;
                });
            });
        },

        deleteCheckedContacts: function () {
            if (this.contacts.some(function (contact) {
                return contact.checked;
            })) {
                this.confirmDialogTitleText = "Удаление контактов";
                this.confirmDialogBodyText = "Вы уверены, что хотите удалить отмеченные контакты?";

                var self = this;
                this.$refs.confirmDialog.show(function () {
                    self.contacts = self.contacts.filter(function (contact) {
                        return contact.checked !== true;
                    });
                });
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
                    // в строке фильтра и повторной фильтрации отобразились ранее скрытые контакты, если
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
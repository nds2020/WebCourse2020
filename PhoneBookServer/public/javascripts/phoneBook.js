function get(url, data) {
    return $.get(url, data);
}

function post(url, data) {
    return $.post({
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

function PhoneBookService() {
    this.baseURL = "/api/";

    this.getContacts = function (term) {
        return get(this.baseURL + "getContacts", {term: term});
    };

    this.addContact = function (contact) {
        return post(this.baseURL + "addContact", {contact: contact});
    };

    this.deleteContacts = function (ids) {
        return post(this.baseURL + "deleteContacts", {ids: ids});
    };
}

Vue.component("modal", {
    props: {
        isConfirmDialog: {
            type: Boolean,
            required: true
        }
    },

    data: function () {
        return {
            onYesFunction: null
        }
    },

    template: "#modal-template",

    methods: {
        show: function (someFunction) {
            this.onYesFunction = someFunction;
            $(this.$refs.dialogTemplate).modal("show");
        },

        clickYes: function () {
            this.onYesFunction();
            $(this.$refs.dialogTemplate).modal("hide");
        },
    }
});

new Vue({
    el: "#app",

    data: {
        contacts: [],
        checkedContactsIds: [],
        lastName: "",
        firstName: "",
        phone: "",
        hasLastName: true,
        hasFirstName: true,
        hasPhone: true,
        term: "",
        dialogTitleText: "",
        dialogBodyText: "",
        isConfirmDialog: true,
        service: new PhoneBookService()
    },

    created: function () {
        this.loadContacts();
    },

    computed: {
        checkedTheadCheckbox: {
            get: function () {
                return (
                    this.contacts.length > 0
                    &&
                    this.contacts.every(function (contact) {
                        return contact.checked;
                    })
                )
            },

            set: function (boolean) {
                this.contacts.forEach(function (contact) {
                    contact.checked = boolean;
                });
            }
        }
    },

    methods: {
        prepareDialog: function (boolean, dialogTitleText, dialogBodyText) {
            this.isConfirmDialog = boolean;
            this.dialogTitleText = dialogTitleText;
            this.dialogBodyText = dialogBodyText;
        },

        fillCheckedContactsIds: function () {
            this.checkedContactsIds = this.contacts.filter(function (contact) {
                return contact.checked
            }).map(function (contact) {
                return contact.id;
            });
        },

        loadContacts: function () {
            this.fillCheckedContactsIds();

            var self = this;
            this.service.getContacts(this.term).done(function (response) {
                self.contacts = response;
                self.contacts.forEach(function(contact) {
                    if (self.checkedContactsIds.includes(contact.id)) {
                        contact.checked = true;
                    }
                });
            }).fail(function () {
                self.prepareDialog(false, "Ошибка сервера", "Не удалось загрузить список контактов");
                self.$refs.modalDialog.show();
            });
        },

        resetFilter: function () {
            this.term = "";
            this.loadContacts();
        },

        addNewContact: function () {
            this.hasLastName = this.lastName ? true : false;
            this.hasFirstName = this.firstName ? true : false;
            this.hasPhone = this.phone ? true : false;

            if (!this.hasLastName || !this.hasFirstName || !this.hasPhone) {
                return;
            }

            var newContact = {
                lastName: this.lastName,
                firstName: this.firstName,
                phone: this.phone,
                checked: false
            }

            var self = this;
            this.service.addContact(newContact).done(function (response) {
                if (!response.success) {
                    self.prepareDialog(false, "Ошибка", response.message);
                    self.$refs.modalDialog.show();
                    return;
                }

                self.lastName = "";
                self.firstName = "";
                self.phone = "";

                self.loadContacts();
            }).fail(function () {
                self.prepareDialog(false, "Ошибка сервера", "Не удалось добавить контакт");
                self.$refs.modalDialog.show();
            });
        },

        clearForm: function () {
            if (this.lastName || this.firstName || this.phone) {
                this.prepareDialog(true, "Отмена ввода", "Вы уверены, что хотите удалить введенные данные?");

                var self = this;
                this.$refs.modalDialog.show(function () {
                    self.lastName = "";
                    self.firstName = "";
                    self.phone = "";
                    self.hasLastName = true;
                    self.hasFirstName = true;
                    self.hasPhone = true;
                });
            }
        },

        deleteContact: function (contact) {
            this.prepareDialog(true, "Удаление контакта", "Вы уверены, что хотите удалить контакт?");
            this.delete([contact.id]);
        },

        deleteCheckedContacts: function () {
            this.fillCheckedContactsIds();

            if (this.checkedContactsIds.length === 0) {
                return;
            }

            this.prepareDialog(true, "Удаление контактов", "Вы уверены, что хотите удалить отмеченные контакты?");
            this.delete(this.checkedContactsIds);
        },

        delete: function (arrayOfIds) {
            var self = this;
            this.$refs.modalDialog.show(function () {
                self.service.deleteContacts(arrayOfIds).done(function (response) {
                    if (!response.success) {
                        self.prepareDialog(false, "Ошибка", response.message);
                        self.$refs.modalDialog.show();
                        return;
                    }

                    self.loadContacts();
                }).fail(function () {
                    self.prepareDialog(false, "Ошибка сервера", "Не удалось удалить контакт(ы)");
                    self.$refs.modalDialog.show();
                });
            });
        }
    }
});
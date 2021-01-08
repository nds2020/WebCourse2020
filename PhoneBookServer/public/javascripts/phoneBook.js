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

Vue.component("modal-dialog", {
    data: function () {
        return {
            onYesFunction: null,
            dialogTitleText: "",
            dialogBodyText: "",
            isConfirmDialog: false
        }
    },

    template: "#modal-template",

    methods: {
        prepare: function (isConfirmDialog, dialogTitleText, dialogBodyText, functionOnYesButton) {
            this.isConfirmDialog = isConfirmDialog;
            this.dialogTitleText = dialogTitleText;
            this.dialogBodyText = dialogBodyText;
            this.onYesFunction = functionOnYesButton;
        },

        show: function () {
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
        lastName: null,
        firstName: null,
        phone: null,
        term: "",
        service: new PhoneBookService()
    },

    created: function () {
        this.loadContacts();
    },

    computed: {
        checkedContactsIds: function () {
            return this.contacts.filter(function (contact) {
                return contact.checked
            }).map(function (contact) {
                return contact.id;
            });
        },

        isTheadCheckboxChecked: {
            get: function () {
                return (
                    this.contacts.length > 0
                    &&
                    this.contacts.every(function (contact) {
                        return contact.checked;
                    })
                )
            },

            set: function (checked) {
                this.contacts.forEach(function (contact) {
                    contact.checked = checked;
                });
            }
        }
    },

    methods: {
        loadContacts: function () {
            var self = this;
            this.service.getContacts(this.term).done(function (response) {
                response.forEach(function (contact) {
                    if (self.checkedContactsIds.indexOf(contact.id) >= 0) {
                        contact.checked = true;
                    }
                });
                self.contacts = response;
            }).fail(function () {
                self.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось загрузить список контактов");
                self.$refs.modalDialog.show();
            });
        },

        resetFilter: function () {
            this.term = "";
            this.loadContacts();
        },

        addNewContact: function () {
            this.lastName = this.lastName || "";
            this.firstName = this.firstName || "";
            this.phone = this.phone || "";

            if (!this.lastName || !this.firstName || !this.phone) {
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
                    self.$refs.modalDialog.prepare(false, "Ошибка", response.message);
                    self.$refs.modalDialog.show();
                    return;
                }

                self.lastName = null;
                self.firstName = null;
                self.phone = null;

                self.loadContacts();
            }).fail(function () {
                self.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось добавить контакт");
                self.$refs.modalDialog.show();
            });
        },

        clearForm: function () {
            if (this.lastName || this.firstName || this.phone) {
                var self = this;
                this.$refs.modalDialog.prepare(
                    true, "Отмена ввода", "Вы уверены, что хотите удалить введенные данные?", function () {
                        self.lastName = null;
                        self.firstName = null;
                        self.phone = null;
                    }
                );
                this.$refs.modalDialog.show();
            }
        },

        deleteContact: function (contact) {
            var self = this;
            this.$refs.modalDialog.prepare(
                true, "Удаление контакта", "Вы уверены, что хотите удалить контакт?", function () {
                    self.delete([contact.id]);
                }
            );
            this.$refs.modalDialog.show();
        },

        deleteCheckedContacts: function () {
            if (this.checkedContactsIds.length === 0) {
                return;
            }

            var self = this;
            this.$refs.modalDialog.prepare(
                true, "Удаление контактов", "Вы уверены, что хотите удалить отмеченные контакты?", function () {
                    self.delete(self.checkedContactsIds);
                }
            );
            this.$refs.modalDialog.show();
        },

        delete: function (arrayOfIds) {
            var self = this;
            this.service.deleteContacts(arrayOfIds).done(function (response) {
                if (!response.success) {
                    self.$refs.modalDialog.prepare(false, "Ошибка", response.message);
                    self.$refs.modalDialog.show();
                    return;
                }

                self.loadContacts();
            }).fail(function () {
                self.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось удалить контакт(ы)");
                self.$refs.modalDialog.show();
            });
        }
    }
});
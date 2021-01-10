<template>
    <div v-cloak class="container mt-2">
        <div class="form mb-2">
            <div class="row mb-2">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="last-name" class="mb-1">Фамилия</label>
                    <input v-model.trim="lastName"
                           :class="lastName === null ? '' : lastName ? 'is-valid' : 'is-invalid'"
                           type="text" class="form-control" id="last-name" placeholder="Введите фамилию">
                    <div v-show="!lastName" class="invalid-feedback pl-2">*Необходимо ввести фамилию</div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="first-name" class="mb-1">Имя</label>
                    <input v-model.trim="firstName"
                           :class="firstName === null ? '' : firstName ? 'is-valid' : 'is-invalid'"
                           type="text" class="form-control" id="first-name" placeholder="Введите имя">
                    <div v-show="!firstName" class="invalid-feedback pl-2">*Необходимо ввести имя</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="phone" class="mb-1">Телефон</label>
                    <input v-model.trim="phone"
                           :class="phone === null ? '' : phone ? 'is-valid' : 'is-invalid'"
                           type="tel" class="form-control" id="phone" placeholder="Введите телефон">
                    <div v-show="!phone" class="invalid-feedback pl-2">*Необходимо ввести телефон</div>
                </div>
            </div>

            <div class="row-cols-2">
                <button @click="addNewContact" type="button"
                        class="btn btn-primary col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Добавить
                </button>
                <button @click="clearForm" type="button"
                        class="btn btn-outline-danger col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Очистить
                </button>
            </div>
        </div>

        <div class="filter mb-2">
            <div class="row">
                <div class="col-md-10 col-lg-8">
                    <label for="filter-field" class="mb-1">Фильтр</label>
                    <input v-model="term" @keypress.enter="loadContacts"
                           type="text" class="form-control mb-1" id="filter-field" placeholder="Введите значение">
                </div>
            </div>

            <div class="row-cols-2">
                <button @click="loadContacts" type="button"
                        class="btn btn-primary col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Применить
                </button>
                <button @click="resetFilter" type="button"
                        class="btn btn-secondary col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Сбросить
                </button>
            </div>
        </div>

        <table class="table table-hover">
            <thead>
            <tr class="table-active">
                <th>
                    <!--suppress HtmlFormInputWithoutLabel -->
                    <input v-model="isCheckAllCheckboxChecked" type="checkbox" title="Выбрать все">
                </th>
                <th>№</th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Номер телефона</th>
                <th>
                    <button @click="deleteCheckedContacts" type="button" class="btn btn-sm btn-danger"
                            title="Удалить отмеченные">&#215;
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(contact, index) in contacts" :key="contact.id">
                <td>
                    <!--suppress HtmlFormInputWithoutLabel -->
                    <input type="checkbox" v-model="contact.checked">
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ contact.lastName }}</td>
                <td>{{ contact.firstName }}</td>
                <td>{{ contact.phone }}</td>
                <td>
                    <button @click="deleteContact(contact)"
                            type="button" class="btn btn-sm btn-danger" title="Удалить">&#215;
                    </button>
                </td>
            </tr>
            </tbody>
        </table>

        <modal ref="modalDialog"></modal>
    </div>
</template>

<script>
import PhoneBookService from "./phoneBookService";
import Modal from "./Modal.vue";

export default {
    data() {
        return {
            contacts: [],
            lastName: null,
            firstName: null,
            phone: null,
            term: "",
            service: new PhoneBookService()
        };
    },

    components: {
        Modal
    },

    created() {
        this.loadContacts();
    },

    computed: {
        checkedContactsIds() {
            return this.contacts.filter(contact => contact.checked).map(contact => contact.id);
        },

        isCheckAllCheckboxChecked: {
            get() {
                return this.contacts.length > 0 && this.contacts.every(contact => contact.checked);
            },

            set(checked) {
                this.contacts.forEach(contact => contact.checked = checked);
            }
        }
    },

    methods: {
        loadContacts() {
            this.service.getContacts(this.term)
                .done(response => {
                    response.forEach(contact => {
                        if (this.checkedContactsIds.indexOf(contact.id) >= 0) {
                            contact.checked = true;
                        }
                    });
                    this.contacts = response;
                })
                .fail(() => {
                    this.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось загрузить список контактов");
                    this.$refs.modalDialog.show();
                });
        },

        resetFilter() {
            if (this.term) {
                this.term = "";
                this.loadContacts();
            }
        },

        addNewContact() {
            this.lastName = this.lastName || "";
            this.firstName = this.firstName || "";
            this.phone = this.phone || "";

            if (!this.lastName || !this.firstName || !this.phone) {
                return;
            }

            const newContact = {
                lastName: this.lastName,
                firstName: this.firstName,
                phone: this.phone,
                checked: false
            }

            this.service.addContact(newContact)
                .done(response => {
                    if (!response.success) {
                        this.$refs.modalDialog.prepare(false, "Ошибка", response.message);
                        this.$refs.modalDialog.show();
                        return;
                    }

                    this.lastName = null;
                    this.firstName = null;
                    this.phone = null;
                    this.loadContacts();
                })
                .fail(() => {
                    this.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось добавить контакт");
                    this.$refs.modalDialog.show();
                });
        },

        clearForm() {
            if (this.lastName || this.firstName || this.phone) {
                this.$refs.modalDialog.prepare(
                    true, "Отмена ввода", "Вы уверены, что хотите удалить введенные данные?", () => {
                        this.lastName = null;
                        this.firstName = null;
                        this.phone = null;
                    }
                );
                this.$refs.modalDialog.show();
            }
        },

        deleteContact(contact) {
            this.$refs.modalDialog.prepare(
                true, "Удаление контакта", "Вы уверены, что хотите удалить контакт?", () => {
                    this.delete([contact.id]);
                }
            );
            this.$refs.modalDialog.show();
        },

        deleteCheckedContacts() {
            if (this.checkedContactsIds.length === 0) {
                return;
            }

            this.$refs.modalDialog.prepare(
                true, "Удаление контактов", "Вы уверены, что хотите удалить отмеченные контакты?", () => {
                    this.delete(this.checkedContactsIds);
                }
            );
            this.$refs.modalDialog.show();
        },

        delete(arrayOfIds) {
            this.service.deleteContacts(arrayOfIds)
                .done(response => {
                    if (!response.success) {
                        this.$refs.modalDialog.prepare(false, "Ошибка", response.message);
                        this.$refs.modalDialog.show();
                        return;
                    }

                    this.loadContacts();
                })
                .fail(() => {
                    this.$refs.modalDialog.prepare(false, "Ошибка сервера", "Не удалось удалить контакт(ы)");
                    this.$refs.modalDialog.show();
                });
        }
    }
}
</script>
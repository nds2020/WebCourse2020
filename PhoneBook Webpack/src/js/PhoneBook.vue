<template>
    <div v-cloak class="container mt-2">
        <div class="form mb-2">
            <div class="row mb-2">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="new-last-name" class="mb-1">Фамилия</label>
                    <input v-model.trim="newLastName"
                           :class="newLastName === null ? '' : newLastName ? 'is-valid' : 'is-invalid'"
                           type="text" class="form-control" id="new-last-name" placeholder="Введите фамилию">
                    <div v-show="!newLastName" class="invalid-feedback pl-2">*Необходимо ввести фамилию</div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="new-first-name" class="mb-1">Имя</label>
                    <input v-model.trim="newFirstName"
                           :class="newFirstName === null ? '' : newFirstName ? 'is-valid' : 'is-invalid'"
                           type="text" class="form-control" id="new-first-name" placeholder="Введите имя">
                    <div v-show="!newFirstName" class="invalid-feedback pl-2">*Необходимо ввести имя</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-10 col-lg-8 m-0">
                    <label for="new-phone" class="mb-1">Телефон</label>
                    <input v-model.trim="newPhone"
                           :class="newPhone === null ? '' : (newPhone && !hasSuchPhone) ? 'is-valid' : 'is-invalid'"
                           type="tel" class="form-control" id="new-phone" placeholder="Введите телефон">
                    <div v-show="!newPhone || hasSuchPhone" class="invalid-feedback pl-2">{{ newPhoneErrorText }}</div>
                </div>
            </div>

            <div class="row-cols-2">
                <button @click="addNewContact" type="button"
                        class="btn btn-primary col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Добавить
                </button>
                <button @click="clearInputData" type="button"
                        class="btn btn-outline-danger col-12 col-sm-4 col-md-3 col-lg-2 mb-1">Очистить
                </button>
            </div>
        </div>

        <div class="filter mb-2">
            <div class="row">
                <div class="col-md-10 col-lg-8">
                    <label for="filter-field" class="mb-1">Фильтр</label>
                    <input v-model="filterText" @keypress.enter="applyFilter"
                           type="text" class="form-control mb-1" id="filter-field" placeholder="Введите значение">
                </div>
            </div>

            <div class="row-cols-2">
                <button @click="applyFilter" type="button"
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
                            title="Удалить выбранные">&#215;
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(contact, index) in contacts" :key="contact.id" :class="{ 'd-none': !contact.displayed }">
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

        <confirm-dialog ref="confirmDialog"></confirm-dialog>
    </div>
</template>

<script>
import ConfirmDialog from "./ConfirmDialog.vue";

export default {
    data() {
        return {
            contacts: [],
            newId: 1,
            newLastName: null,
            newFirstName: null,
            newPhone: null,
            filterText: ""
        };
    },

    components: {
        ConfirmDialog
    },

    computed: {
        isCheckAllCheckboxChecked: {
            get() {
                const filteredContacts = this.contacts.filter(contact => contact.displayed);
                return filteredContacts.length > 0 && filteredContacts.every(contact => contact.checked);
            },

            set(checked) {
                this.contacts.forEach(contact => {
                    if (contact.displayed) {
                        contact.checked = checked;
                    }
                });
            }
        },

        newPhoneErrorText() {
            return this.hasSuchPhone ? "*Контакт с указанным номером телефона уже есть в таблице" : "*Необходимо ввести телефон";
        },

        hasSuchPhone() {
            return this.contacts.some(contact => contact.phone === this.newPhone);
        }
    },

    methods: {
        addNewContact() {
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

        clearInputData() {
            if (this.newLastName || this.newFirstName || this.newPhone) {
                this.$refs.confirmDialog.prepare(
                    () => {
                        this.newLastName = null;
                        this.newFirstName = null;
                        this.newPhone = null;
                    },
                    "Отмена ввода", "Вы уверены, что хотите удалить введенные данные?");
                this.$refs.confirmDialog.show();
            }
        },

        deleteContact(contactForDelete) {
            this.$refs.confirmDialog.prepare(
                () => this.contacts = this.contacts.filter(contact => contact !== contactForDelete),
                "Удаление контакта", "Вы уверены, что хотите удалить контакт?");
            this.$refs.confirmDialog.show();
        },

        deleteCheckedContacts() {
            if (this.contacts.some(contact => contact.checked)) {
                this.$refs.confirmDialog.prepare(
                    () => this.contacts = this.contacts.filter(contact => contact.checked !== true),
                    "Удаление контактов", "Вы уверены, что хотите удалить выбранные контакты?");
                this.$refs.confirmDialog.show();
            }
        },

        applyFilter() {
            const filterText = this.filterText.toLowerCase();

            this.contacts.forEach(contact => {
                if (contact.lastName.toLowerCase().indexOf(filterText) === -1 &&
                    contact.firstName.toLowerCase().indexOf(filterText) === -1 &&
                    contact.phone.toLowerCase().indexOf(filterText) === -1) {
                    contact.displayed = false;
                    contact.checked = false;
                } else {
                    contact.displayed = true;
                }
            });
        },

        resetFilter() {
            this.contacts.forEach(contact => contact.displayed = true);
            this.filterText = "";
        }
    }
}
</script>
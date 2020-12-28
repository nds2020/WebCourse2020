import "bootstrap/dist/js/bootstrap.bundle";
import Vue from "vue";
import "../scss/style.scss";
import PhoneBook from "./PhoneBook.vue";

new Vue({
    render: createElement => createElement(PhoneBook)
}).$mount("#app");
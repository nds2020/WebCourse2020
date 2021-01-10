import {get, post} from "./ajax";

export default class PhoneBookService {
    constructor() {
        this.baseURL = "/api/";
    }

    getContacts(term) {
        return get(this.baseURL + "getContacts", {term});
    };

    addContact(contact) {
        return post(this.baseURL + "addContact", {contact});
    };

    deleteContacts(ids) {
        return post(this.baseURL + "deleteContacts", {ids});
    };
}
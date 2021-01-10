const express = require("express");
const router = express.Router();

let contacts = [];
let newId = 1;

router.get("/api/getContacts", (req, res) => {
    const term = (req.query.term || "").toUpperCase();

    const result = term.length === 0
        ? contacts
        : contacts.filter(contact => {
            return contact.lastName.toUpperCase().indexOf(term) >= 0 ||
                contact.firstName.toUpperCase().indexOf(term) >= 0 ||
                contact.phone.toUpperCase().indexOf(term) >= 0;
        });

    res.send(result);
});

router.post("/api/deleteContacts", (req, res) => {
    const ids = req.body.ids;

    ids.forEach(id => {
        contacts = contacts.filter(contact => {
            return contact.id !== id;
        });
    });

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/addContact", (req, res) => {
    const contact = req.body.contact;

    if (!contact) {
        res.send({
            success: false,
            message: "Неверный формат данных"
        });

        return;
    }

    if (!contact.lastName) {
        res.send({
            success: false,
            message: "Необходимо задать фамилию контакта"
        });

        return;
    }

    if (!contact.firstName) {
        res.send({
            success: false,
            message: "Необходимо задать имя контакта"
        });

        return;
    }

    if (!contact.phone) {
        res.send({
            success: false,
            message: "Необходимо задать телефон контакта"
        });

        return;
    }

    if (contacts.some(c => {
        return c.phone === contact.phone;
    })) {
        res.send({
            success: false,
            message: "Уже есть контакт с указанным телефоном"
        });

        return;
    }

    contact.id = newId;
    newId++;
    contacts.push(contact);

    res.send({
        success: true,
        message: null
    });
});

router.get("/", (req, res) => {
    res.render("index", {title: "Телефонная книга"});
});

module.exports = router;
const express = require('express');
const {firestore} = require("firebase-functions-helper/dist");

const {hp} = require('./utils');


const COLLECTION_NAME = "contacts";


module.exports = (db) => {


    const getAll = async (req, res) => {
        console.log(`start:: getAll:contact`);

        const [dbErr, doc] = await hp(firestore.backup(db, COLLECTION_NAME));

        if (dbErr) {
            console.log("failed:: getAll:contact");
            res.status(500).send('GET: FAILED_TO_GET_RECORDS');
        } else {
            console.log("success:: getAll:contact");
            const contacts = Object.keys(doc.contacts).map(id => ({id, ...doc.contacts[id]}));
            return res.status(200).send(contacts);
        }

        console.log("end:: getAll:contact");
    };


    const get = async (req, res) => {
        const id = req.params.id;
        console.log(`start:: get:contact (id: ${id})`);

        const [dbErr, doc] = await hp(firestore.getDocument(db, COLLECTION_NAME, id));

        if (dbErr) {
            console.log("failed:: get:contact");
            res.status(404).send('GET: DOC_NOT_FOUND');
        } else {
            console.log("success:: get:contact");
            res.status(201).send({id, ...doc});
        }

        console.log("end:: get:contact");
    };



    const create = async (req, res) => {
        console.log("start:: create:contact", JSON.stringify(req.body));

        const {firstName, lastName, email, mobile} = req.body;

        if (firstName && lastName && (email || mobile)) {

            const contact = { firstName, lastName };
            if (email) contact.email = email;
            if (mobile) contact.mobile = mobile;

            const [dbErr, doc] = await hp(firestore.createNewDocument(db, COLLECTION_NAME, contact));

            if (dbErr) {
                console.log("failed:: create:contact");
                const creationErr = 'CREATE_FAILED: db error';
                res.status(500).send(creationErr);
            } else {
                console.log("success:: create:contact");
                res.status(201).send({id: doc.id, ...contact});
            }

        } else {

            console.log("err:: create:contact");
            const validationErr = 'CREATE_FAILED: firstName && lastName && (email || mobile) required';
            res.status(400).send(validationErr);

        }

        console.log("end:: create:contact");
    };

    const update = async (req, res) => {
        const id = req.params.id;
        console.log(`start:: update:contact (id: ${id})`, JSON.stringify(req.body));

        const {firstName, lastName, email, mobile} = req.body;

        const contact = {};
        if (firstName) contact.firstName = firstName;
        if (lastName) contact.lastName = lastName;
        if (email) contact.email = email;
        if (mobile) contact.mobile = mobile;

        const [dbErr, doc] = await hp(firestore.updateDocument(db, COLLECTION_NAME, id, contact));

        if (dbErr) {
            console.log("failed:: update:contact");
            const updateErr = 'UPDATE_FAILED: db error';
            res.status(500).send(updateErr);
        } else {
            console.log("success:: update:contact");
            res.status(204).send();
        }

        console.log("end:: update:contact");
    };


    const remove = async (req, res) => {
        const id = req.params.id;
        console.log(`start:: delete:contact (id: ${id})`, JSON.stringify(req.body));

        const [dbErr, doc] = await hp(firestore.deleteDocument(db, COLLECTION_NAME, id));

        if (dbErr) {
            console.log("failed:: delete:contact");
            const updateErr = 'UPDATE_FAILED: db error';
            res.status(500).send(updateErr);
        } else {
            console.log("success:: delete:contact");
            res.status(204).send();
        }

        console.log("end:: delete:contact");
    };

    return { getAll, get, create, update, remove };
};

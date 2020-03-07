const express = require('express');
const {firestore} = require("firebase-functions-helper/dist");

const {hp} = require('./utils');


module.exports = (db) => {

    const getAll = async (req, res) => {
        const collectionId = req.params.collectionId;
        console.log(`start:: getAll:${collectionId}`);

        const [dbErr, doc] = await hp(firestore.backup(db, collectionId));

        if (dbErr) {
            console.log(`failed:: getAll:${collectionId}`);
            res.status(500).send('GET: FAILED_TO_GET_RECORDS');
        } else {
            console.log(`success:: getAll:${collectionId}`);
            let collection = [];
            if (doc[collectionId]) {
                collection = Object.keys(doc[collectionId]).map(id => ({id, ...doc[collectionId][id]}));
            }
            return res.status(200).send(collection);
        }

        console.log(`end:: getAll:${collectionId}`);
    };


    const get = async (req, res) => {
        const collectionId = req.params.collectionId;
        const id = req.params.id;
        console.log(`start:: get:${collectionId} (id: ${id})`);

        const [dbErr, doc] = await hp(firestore.getDocument(db, collectionId, id));

        if (dbErr) {
            console.log(`failed:: get:${collectionId}`);
            res.status(404).send('GET: DOC_NOT_FOUND');
        } else {
            console.log(`success:: get:${collectionId}`);
            res.status(201).send({id, ...doc});
        }

        console.log(`end:: get:${collectionId}`);
    };



    const create = async (req, res) => {
        const collectionId = req.params.collectionId;
        console.log(`start:: create:${collectionId}`, JSON.stringify(req.body));

        const [dbErr, doc] = await hp(firestore.createNewDocument(db, collectionId, req.body));

        if (dbErr) {
            console.log(`failed:: create:${collectionId}`);
            const creationErr = 'CREATE_FAILED: db error';
            res.status(500).send(creationErr);
        } else {
            console.log(`success:: create:${collectionId}`);
            res.status(201).send({id: doc.id, ...req.body});
        }
        console.log(`end:: create:${collectionId}`);
    };

    const update = async (req, res) => {
        const collectionId = req.params.collectionId;
        const id = req.params.id;
        console.log(`start:: update:${collectionId} (id: ${id})`, JSON.stringify(req.body));

        const [dbErr, doc] = await hp(firestore.updateDocument(db, collectionId, id, req.body));

        if (dbErr) {
            console.log(`failed:: update:${collectionId}`);
            const updateErr = 'UPDATE_FAILED: db error';
            res.status(500).send(updateErr);
        } else {
            console.log(`success:: update:${collectionId}`);
            res.status(204).send();
        }

        console.log(`end:: update:${collectionId}`);
    };


    const remove = async (req, res) => {
        const collectionId = req.params.collectionId;
        const id = req.params.id;
        console.log(`start:: delete:${collectionId} (id: ${id})`, JSON.stringify(req.body));

        const [dbErr, doc] = await hp(firestore.deleteDocument(db, collectionId, id));

        if (dbErr) {
            console.log(`failed:: delete:${collectionId}`);
            const updateErr = 'UPDATE_FAILED: db error';
            res.status(500).send(updateErr);
        } else {
            console.log(`success:: delete:${collectionId}`);
            res.status(204).send();
        }

        console.log(`end:: delete:${collectionId}`);
    };

    return { getAll, get, create, update, remove };
};

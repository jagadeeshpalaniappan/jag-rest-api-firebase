// https://itnext.io/building-a-serverless-restful-api-with-cloud-functions-firestore-and-express-f917a305d4e6

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper/dist");
const express = require("express");
const bodyParser = require("body-parser");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const contactsCollection = "contacts";


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const api = express();
app.use("/api/v1", api);

api.get("/", (req, res) => {
    res.send("Welcome to JAG REST API..");
});

// Add new contact
api.post("/contacts", async (req, res) => {
    console.log('post:contacts');
    try {
        const contact = {
            firstName: req.body["firstName"],
            lastName: req.body["lastName"],
            email: req.body["email"]
        };
        const newDoc = await firebaseHelper.firestore.createNewDocument(
            db,
            contactsCollection,
            contact
        );

        console.log('success: post:contacts');
        res.status(201).send(`Created a new contact: ${newDoc.id}`);
    } catch (error) {
        console.log('err: post:contacts');
        res
            .status(400)
            .send(`Contact should only contains firstName, lastName and email!!!`);
    }
});
// Update new contact
api.patch("/contacts/:contactId", async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore.updateDocument(
        db,
        contactsCollection,
        req.params.contactId,
        req.body
    );
    res.status(204).send(`Update a new contact: ${updatedDoc}`);
});
// View a contact
api.get("/contacts/:contactId", (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, contactsCollection, req.params.contactId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get contact: ${error}`));
});
// View all contacts
api.get("/contacts", (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get contacts: ${error}`));
});

// Delete a contact
api.delete("/contacts/:contactId", async (req, res) => {
    const deletedContact = await firebaseHelper.firestore.deleteDocument(
        db,
        contactsCollection,
        req.params.contactId
    );
    res.status(204).send(`Contact is deleted: ${deletedContact}`);
});


exports.webApi = functions.https.onRequest(app);


// app.listen(8080, () => { console.log("Server started"); });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

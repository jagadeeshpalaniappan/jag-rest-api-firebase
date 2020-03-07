// https://itnext.io/building-a-serverless-restful-api-with-cloud-functions-firestore-and-express-f917a305d4e6

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');


// DB:INIT
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

// Add headers
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
//
//     // Pass to next layer of middleware
//     next();
// });


// ROUTE:INIT

const contacts = require('./contacts')(db);

const contactsRouter = express.Router();
contactsRouter.options('*', cors());
contactsRouter.get("/contacts", contacts.getAll);   // View all contacts
contactsRouter.get("/contacts/:id", contacts.get); // View a contact
contactsRouter.post("/contacts", contacts.create);  // Add new contact
contactsRouter.patch("/contacts/:id", contacts.update);  // Update existing contact
contactsRouter.delete("/contacts/:id", contacts.remove);   // Delete a contact
app.use("/api/v1", contactsRouter);




exports.webApi = functions.https.onRequest(app);

// app.listen(8080, () => { console.log("Server started"); });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

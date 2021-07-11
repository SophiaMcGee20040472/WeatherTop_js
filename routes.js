"use strict";

const express = require("express");
const router = express.Router();

const start = require("./controllers/start.js");
const station = require('./controllers/station.js');
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");

router.get("/", dashboard.index);
router.get('/station/:id', station.index);
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);
router.get("/start", start.index);

router.post('/station/:id/addreading',station.addReading);
router.get('/station/:id/deletereading/:readingid', station.deleteReading);
router.post('/dashboard/addstation', dashboard.addStation);
router.get('/dashboard/deletestation/:id', dashboard.deleteStation);


module.exports = router;


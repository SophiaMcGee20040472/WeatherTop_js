"use strict";

const express = require("express");
const router = express.Router();

const start = require("./controllers/start.js");
const station = require('./controllers/station.js');
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");

router.get('/station/:id', station.index);
router.get("/", dashboard.index);
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);
router.get("/start", start.index);
router.get('/dashboard/deletestation/:id', dashboard.deleteStation);
router.get('/station/:id/deletereading/:readingid', station.deleteReading);




module.exports = router;


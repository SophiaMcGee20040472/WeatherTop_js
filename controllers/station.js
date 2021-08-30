"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");

const uuid = require("uuid");
const hbs = require("hbs");
const axios = require("axios");

hbs.registerHelper("checkCode", function(code, codeString) {
  if (codeString === codeString) {
    return true;
  }
  return false;
});

const station = {
  async index(request, response) {
    const stationId = request.params.id;
    let report = {};
    const station = stationStore.getStation(stationId);
    let T = new Date();
    T.setHours(T.getHours() + 1);
    logger.info("Station id = " + stationId);
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${station.lat}&lon=${station.lng}&units=metric&appid=1cdb6cb3ab3eac589865a5bc92c1c47f`;
    const result = await axios.get(requestUrl);
    if (result.status === 200) {
      const reading = result.data.current;
      report.id = uuid.v1();
      report.date = new Date(T).toISOString().replace("T", " ").replace("Z", "");
      report.code = reading.weather[0].id;
      report.temp = reading.temp;
      report.windspeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;

      // retrieving and storing graph info
      report.tempTrend = [];
      report.pressureTrend = [];
      report.windTrend = [];
      report.windDirectionTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i = 0; i < trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        report.pressureTrend.push(trends[i].pressure);
        report.windTrend.push(trends[i].wind_speed);
        report.windDirectionTrend.push(trends[i].wind_deg);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);

      }
    }

    const viewData = {
      title: "Station",
      station: stationStore.getStationIdData(stationId),
      reading: report
    };

    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);

  },

  addReading(request, response) {
    const stationId = request.params.id;
    console.log(request, response, "add reading");
    let T = new Date();
    T.setHours(T.getHours() + 1);
    const newReading = {
      id: uuid.v1(),
      name: request.body.name,
      date: new Date(T).toISOString().replace("T", " ").replace("Z", ""),
      code: request.body.code,
      temp: request.body.temp,
      windspeed: request.body.windspeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure

    };

    logger.debug("New Reading = ", newReading);
    stationStore.saveReading(stationId, newReading);
    response.redirect("/station/" + stationId);

  },


// autogenerate table and graph method + retrieving api info
  async addreport(request, response) {
    let report = {};
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    let T = new Date();
    T.setHours(T.getHours() + 1);
    logger.info("Station id = " + stationId);
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${station.lat}&lon=${station.lng}&units=metric&appid=1cdb6cb3ab3eac589865a5bc92c1c47f`;
    const result = await axios.get(requestUrl);
    if (result.status === 200) {
      const reading = result.data.current;
      report.id = uuid.v1();
      report.date = new Date(T).toISOString().replace("T", " ").replace("Z", "");
      report.code = reading.weather[0].id;
      report.temp = reading.temp;
      report.windspeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;

    }

    stationStore.saveReading(stationId, report);
    response.redirect("/station/" + stationId);

  }

};

module.exports = station;
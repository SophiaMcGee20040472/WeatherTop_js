"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const accounts = require("./Accounts.js");
const uuid = require("uuid");

const hbs = require("hbs");
hbs.registerHelper("checkCode", function(codeValue, codeString) {
  if (codeString === codeString) {
    return true;
  }
  return false;
});


const dashboard = {

  index(request, response) {

    logger.info("dashboard rendering");

    const loggedInUser = accounts.getCurrentUser(request);
    // Get Stations for logged in user.
    let stations = stationStore.getUserStations(loggedInUser.id);
    //sorting station names alphabetically
    stations.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

    /*looping to get all the stations and there readings */
    for (let i = 0; i < stations.length; i++) {
      let readings = stations[i].readings;

      if (readings >= 0) {
      } else {
        let weatherData = {};
        //getting last readings from readings array
        let latestReading = readings[readings.length - 1];

        //keys             //values
          weatherData.temp = stationStore.getTemp(latestReading.temp),
          weatherData.code = stationStore.getCodeForValue(latestReading.code),
          weatherData.windspeed = stationStore.getWindChill(latestReading.temp, latestReading.windspeed),
          weatherData.pressure = stationStore.getLastPressure(latestReading.pressure),
          weatherData.beaufort = stationStore.getBeaufort(latestReading.windspeed),
          weatherData.windDirection = stationStore.getCompassDirection(latestReading.windDirection);
          weatherData.tempVal = stationStore.getTempValue(latestReading.temp);
          weatherData.codeIcon = (latestReading.code);
          weatherData.maxTemp = stationStore.getMaxValues([stations[i].readingsToReturn.MaxTemp]),
          weatherData.maxPressure = stationStore.getMaxValues([stations[i].readingsToReturn.pressureMax]),
          weatherData.maxWind = stationStore.getMaxValues([stations[i].readingsToReturn.windMax]),
          weatherData.minWind = stationStore.getMinValues([stations[i].readingsToReturn.windMin]),
          weatherData.minPressure = stationStore.getMinValues([stations[i].readingsToReturn.pressureMin]),
          weatherData.minTemp = stationStore.getMinValues([stations[i].readingsToReturn.MinTemp]);

        /*I use this stats key to link to other keys above for hbs*/
        stations[i].stats = weatherData;
      }
    }
    const viewData = {
      title: "Station Dashboard",
      station: stations
    };

    logger.info("about to render", viewData.station);
    response.render("dashboard", viewData);
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: request.body.name,
      lat: request.body.lat,
      lng: request.body.lng,
      readings: []
    };

    logger.debug("Creating a new Station", newStation);
    stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;




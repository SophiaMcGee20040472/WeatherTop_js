"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require('uuid');

const hbs = require('hbs');
hbs.registerHelper('checkCode', function(codeValue, codeString){
  if(codeString === codeString){
    return true
  }
  return false
});


const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug('Station id = ', stationId);
    const viewData = {
      title: 'Station',
      station: stationStore.getStationIdData(stationId),

    };

    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect('/station/' + stationId);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    console.log(request,response,"add reading")
    const newReading = {
      id: uuid.v1(),
      name: request.body.name,
      code: request.body.code,
      temp: request.body.temp,
      windspeed: request.body.windspeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,

    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect('/station/' + stationId);
  },

};

module.exports = station;
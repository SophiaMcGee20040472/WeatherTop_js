'use strict';

const logger = require('../utils/logger');
const stationStore = require('../models/station-store');

const station = {
    deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect('/station/' + stationId);
  },
  index(request, response) {
    const stationId = request.params.id;
    logger.debug('Station id = ', stationId);
    const viewData = {
      title: 'Station',
      station: stationStore.getStation(stationId),
    };
    response.render('station', viewData);
  },
};

module.exports = station;

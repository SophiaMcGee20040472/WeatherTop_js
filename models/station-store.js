"use strict";
const _ = require("lodash");
const station = require("../controllers/station");
const stationStore = {

  stationCollection: require("./station-store.json").stationCollection,

  getAllStations() {
    return this.stationCollection;
  },
  removeReading(id, readingId) {
    const station = this.getStation(id);
    _.remove(station.readings, { id: readingId });

  },
  removeStation(id) {
    _.remove(this.stationCollection, { id: id });
  },

  getStation(id) {
    return _.find(this.stationCollection, { id: id });
  },

  getStationData() {
    let listOfStations = stationStore.getAllStations();

    //return listOfStations;

    let readingsToReturn = [];

    for (let i = 0; i < listOfStations.length; i++) {
      let station = listOfStations[i]
      let lastReadings = station.readings[station.readings.length - 1]


      lastReadings.tempCelsius = this.getTemp(lastReadings.temp)
      lastReadings.tempText = this.getTempValue(lastReadings.temp)
      lastReadings.windForce = this.getBeaufort(lastReadings.windspeed)
      lastReadings.lastPressure = this.getLastPressure(lastReadings.pressure)
      //this taking the number of code and using a case/switch statement will return text value.
      lastReadings.codeString = this.getCodeForValue(lastReadings.code)
      console.log(lastReadings.code)
      station.readingsToReturn = lastReadings
    }


    console.log(readingsToReturn)
    console.log(listOfStations)

    return listOfStations;

  },
  getCodeForValue(code) {
    console.log(code)

    let newCode;
    switch (code) {
      case '100':
        newCode = "Clear";
        break;
      case '200':
        newCode = "Partial Clouds";
        break;
      case '300':
        newCode = "Cloudy";
        break;
      case '400':
        newCode = "Light Showers";
        break;
      case '500':
        newCode = "Heavy Showers";
        break;
      case '600':
        newCode = "Rain";
        break;
      case '700':
        newCode = "Rain";
        break;
      case '800':
        newCode = "Thunder"
        break;

    }
    console.log(newCode)

    return newCode
  },

  getTempValue(temp) {
    console.log(temp)
    return temp * 9 / 5 + 32;
  },
  getTemp(temp){
    return temp;
  },

  getBeaufort(windspeed){
    if (windspeed <= 1) {
      return 0;
    } else if (windspeed <= 5) {
      return 1;
    } else if (windspeed <= 11) {
      return 2;
    } else if (windspeed <= 19) {
      return 3;
    } else if (windspeed <= 28) {
      return 4;
    } else if (windspeed <= 38) {
      return 5;
    } else if (windspeed <= 49) {
      return 6;
    } else if (windspeed <= 61) {
      return 7;
    } else if (windspeed <= 74) {
      return 8;
    } else if (windspeed <= 88) {
      return 9;
    } else if (windspeed <= 102) {
      return 10;
    } else if (windspeed <= 117) {
      return 11;
    } else {
      return 12;
    }
  },
  getLastPressure(pressure){
    return pressure;


  }



};

module.exports = stationStore;
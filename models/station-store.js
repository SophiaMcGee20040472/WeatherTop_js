"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const stationStore = {
  store: new JsonStore("./models/station-store.json", {
    stationCollection: [],

  }),
  collection: "stationCollection",


  getAllStations() {
    return this.store.findAll(this.collection);
  },

  addStation(newStation) {
    this.store.add(this.collection, newStation);
    this.store.save();
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getReadings(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getReading(id, readingId) {
    const station = this.store.findOneBy(this.collection, { id: id });
    const readings = station.readings.filter(reading => reading.id == readingId);
    return readings[0];
  },

  updateReadings(reading, updatedReading) {
    reading.code = updatedReading.code;
    reading.temp = updatedReading.temp;
    reading.windspeed = updatedReading.windspeed;
    reading.windDirection = updatedReading.windDirection;
    reading.pressure = updatedReading.pressure

    this.store.save();
},

  saveReading(id, reading) {
    const station = this.getReadings(id);
    station.readings.push(reading);
    this.store.save();
  },

  removeStation(id) {
    const readings = this.getStation(id);
    this.store.remove(this.collection, readings);
    this.store.save();
  },

  removeReading(id, readingId) {
    const station = this.getStation(id);
    const readings = station.readings;
    _.remove(readings, { id: readingId });
    this.store.save();

  },

  getUserStations(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  getCodeForValue(code) {

    let newCode;
    switch (code) {
      case "100":
        newCode = "Clear";
        break;
      case "200":
        newCode = "Partial Clouds";
        break;
      case "300":
        newCode = "Cloudy";
        break;
      case "400":
        newCode = "Light Showers";
        break;
      case "500":
        newCode = "Heavy Showers";
        break;
      case "600":
        newCode = "Rain";
        break;
      case "700":
        newCode = "Snow";
        break;
      case "800":
        newCode = "Thunder";
        break;

    }
    return newCode;
  },

  getTempValue(temp) {
    return temp * 9 / 5 + 32;

  },
  getTemp(temp) {
    return temp;
  },

  getBeaufort(windspeed) {
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

  getLastPressure(pressure) {
    return pressure;
  },

  getWindChill(temp,windspeed) {
    let chill = 13.12 + 0.6215 * temp - 11.37 * (Math.pow(windspeed, 0.16)) + 0.3965 * temp* (Math.pow(windspeed, 0.16))
    var chilly = chill.toFixed(1);
    return chilly;
  },

  getMinValues(listvalues){
    return Math.min.apply(Math, listvalues)
  },
  getMaxValues(listvalues){
    return Math.max.apply(Math, listvalues)
  },

  getCompassDirection(windDirection) {
    if (windDirection > 11.25 && windDirection <= 33.75) {
      return "North North East";
    } else if (windDirection > 33.75 && windDirection <= 56.25) {
      return "East North East";
    } else if (windDirection > 56.25 && windDirection <= 78.75) {
      return "East";
    } else if (windDirection > 78.75 && windDirection <= 101.25) {
      return "East South East";
    } else if (windDirection > 101.25 && windDirection <= 123.75) {
      return "East South East";
    } else if (windDirection > 123.75 && windDirection <= 146.25) {
      return "South East";
    } else if (windDirection > 146.25 && windDirection <= 168.75) {
      return "South South East";
    } else if (windDirection > 168.75 && windDirection <= 191.25) {
      return "South";
    } else if (windDirection > 191.25 && windDirection <= 213.75) {
      return "South South West";
    } else if (windDirection > 213.75 && windDirection <= 236.25) {
      return "South West";
    } else if (windDirection > 236.25 && windDirection <= 258.75) {
      return "West South West";
    } else if (windDirection > 258.75 && windDirection <= 281.25) {
      return "West";
    } else if (windDirection > 281.25 && windDirection <= 303.75) {
      return "West North West";
    } else if (windDirection > 303.75 && windDirection <= 326.25) {
      return "North West";
    } else if (windDirection > 326.25 && windDirection <= 348.75) {
      return "North North West";
    } else {
      return "North";
    }
  },

  getWindTrend(readings) {
    let windTrend = "";

    if (readings.length >= 3) {

      let firstTrend = readings[readings.length - 1].windspeed;
      let secondTrend = readings[readings.length - 2].windspeed;
      let thirdTrend = readings[readings.length - 3].windspeed;

      if ((firstTrend > secondTrend) && (secondTrend > thirdTrend)){
        windTrend = "arrow up"

      } else if ((thirdTrend > secondTrend) &&(secondTrend <thirdTrend)){
        windTrend = "arrow down"

      } else {
        windTrend = "Steady"
      }
      return windTrend;
    }

  },

  getTempTrend(readings) {
    let tempTrend = "";

    if (readings.length >= 3) {

      let firstTrend = readings[readings.length - 1].temp;
      let secondTrend = readings[readings.length - 2].temp;
      let thirdTrend = readings[readings.length - 3].temp;

      if ((firstTrend > secondTrend) && (secondTrend > thirdTrend)){
        tempTrend = "arrow up"

      } else if ((thirdTrend > secondTrend) &&(secondTrend <thirdTrend)){
        tempTrend = "arrow down"

      } else {
        tempTrend = "Steady"
      }
      return tempTrend;
    }

  },
  getPressureTrend(readings) {
    let pressureTrend = "";

    if (readings.length >= 3) {

      let firstTrend = readings[readings.length - 1].temp;
      let secondTrend = readings[readings.length - 2].temp;
      let thirdTrend = readings[readings.length - 3].temp;

      if ((firstTrend > secondTrend) && (secondTrend > thirdTrend)){
        pressureTrend = "arrow up"

      } else if ((thirdTrend > secondTrend) &&(secondTrend <thirdTrend)){
        pressureTrend = "arrow down"

      } else {
        pressureTrend = "Steady"
      }
      return pressureTrend;
    }

  },

  getStationIdData(stationId) {

    let station = stationStore.getStation(stationId);
    if (station.readings.length > 0) {

      let lastReadings = station.readings[station.readings.length - 1];

      let stats ={}
      let pressures = station.readings.map(item => { return item.pressure})
      let winds = station.readings.map(item => { return item.windspeed})
      let temperature = station.readings.map(item => { return item.temp})

      stats.windMin = this.getMinValues(winds);
      stats.windMax = this.getMaxValues(winds);
      stats.pressureMin = this.getMinValues(pressures);
      stats.pressureMax = this.getMaxValues(pressures);
      stats.MinTemp = this.getMinValues(temperature);
      stats.MaxTemp = this.getMaxValues(temperature);

      stats.windTrends = this.getWindTrend(station.readings);
      stats.tempTrends = this.getTempTrend(station.readings);
      stats.pressureTrends =this.getPressureTrend(station.readings);

      stats.windChillString = this.getWindChill(lastReadings.temp,lastReadings.windspeed);
      stats.windDirectionString = this.getCompassDirection(lastReadings.windDirection);
      stats.tempCelsius = this.getTemp(lastReadings.temp);
      stats.tempText = this.getTempValue(lastReadings.temp);
      stats.windForce = this.getBeaufort(lastReadings.windspeed);
      stats.lastPressure = this.getLastPressure(lastReadings.pressure);
      //this taking the number of code and using a case/switch statement will return text value.
      stats.codeString = this.getCodeForValue(lastReadings.code);
      stats.code = lastReadings.code
      station.readingsToReturn = stats;
    }

    console.log(station)
    return station;
  },


};


module.exports = stationStore;
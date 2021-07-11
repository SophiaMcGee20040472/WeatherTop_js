"use strict";

const _ = require("lodash");


const stationStore = {

  stationCollection: require("./station-store.json").stationCollection,

  getAllStations() {
    return this.stationCollection;
  },

  getStation(id) {
    let foundStation = null;
    for (let station of this.stationCollection) {
      if (id == station.id) {
        foundStation = station;
      }
    }

    return foundStation;
  },

  removeStation(id) {
    _.remove(this.stationCollection, { id: id });
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    station.readings.push(reading);
  },
  removeReading(id, readingId) {
    const station = this.getStation(id);
    _.remove(station.readings, { id: readingId });

  },
  addStation(station) {
    this.stationCollection.push(station);
  },
  getCodeForValue(code) {
    //console.log(code);

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
        newCode = "Rain";
        break;
      case "800":
        newCode = "Thunder";
        break;

    }
    // console.log(newCode);

    return newCode;
  },

  getTempValue(temp) {
    //console.log(temp);
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
     var chilly = chill.toFixed(2);
    return chilly;
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


  getStationIdData(stationId) {

    let station = stationStore.getStation(stationId);
    if (station.readings.length > 0) {

      let lastReadings = station.readings[station.readings.length - 1];

      lastReadings.windChillString = this.getWindChill(lastReadings.temp,lastReadings.windspeed);
      lastReadings.windDirectionString = this.getCompassDirection(lastReadings.windDirection);
      lastReadings.tempCelsius = this.getTemp(lastReadings.temp);
      lastReadings.tempText = this.getTempValue(lastReadings.temp);
      lastReadings.windForce = this.getBeaufort(lastReadings.windspeed);
      lastReadings.lastPressure = this.getLastPressure(lastReadings.pressure);
      //this taking the number of code and using a case/switch statement will return text value.
      lastReadings.codeString = this.getCodeForValue(lastReadings.code);
      station.readingsToReturn = lastReadings;
    }
    return station;
  }


};


module.exports = stationStore;
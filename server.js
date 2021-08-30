"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      checkCode(code) {
        console.log(code);
        if (code === "100") {
          return "right floated big red sun icon";
        } else if (code === "200") {
          return "right floated big yellow cloud sun icon";
        } else if (code === "300") {
          return "right floated big white cloud icon";
        } else if (code === "400") {
          return "right floated big yellow sun rain cloud icon";
        } else if (code === "500") {
          return "right floated big blue cloud showers heavy icon";
        } else if (code === "600") {
          return "right floated big pink umbrella icon";
        } else if (code === "700") {
          return "right floated big white snowflake icon";
        } else if (code === "800") {
          return "right floated big yellow bolt icon";
        } else {
          return "right floated big pink sun rain cloud icon";
        }
      }
    }
  })
);

app.set("view engine", "hbs");

const hbs = require("hbs");
hbs.registerHelper("checkCode", function(code, codeString) {
  if (codeString === codeString) {
    return true;
  }
  return false;
});

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`glitch-template-1 started on port ${listener.address().port}`);
});
const { isInt } = require("./PropertiesMethods")

const Properties = {
  "autoIncrement": value => typeof value === "boolean",
  "required": value => typeof value === "boolean",
  "minSize": isInt,
  "maxSize": isInt,
}

const Validator = {
  "autoIncrement": () => Validator,
  "required": (value, property) => value === "" || typeof value !== "string" ? false : true,
  "minSize": (value, property) => value >=  property,
  "maxSize": (value, property) => value <= property,
}

module.exports = {
  Properties,
  Validator
}
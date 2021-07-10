const { isDateTime, isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "dateTime",
  transform: isFunction,
  updateDate: isBoolean,
  required: isBoolean,
}

const Validators = {
  type: value => ({state: isDateTime(value)}),
  transform: (value, property) => ({state: true, return: property(value)}),
  updateDate: (value, property) => ({
    state: true, 
    return: property ? new Date().toString() : value 
  }),
  required: (value, property) => (property ? {state: isDateTime(value)} : {state : true}),
}

module.exports = {
  Properties,
  Validators
}
const { isDateTime, isBoolean, isFunction } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "dateTime",
  transform: value => isFunction(value) && isDateTime(value(null)),
  createDate: isBoolean,
  updateDate: isBoolean,
  required: isBoolean,
}

const Validators = {
  type: value => ({state: isDateTime(value)}),
  transform: (value, property) => ({state: true, return: property(value)}),
  createDate: (value, property) => ({
    state: true, 
    return: property ? new Date().toString() : value 
  }),
  updateDate: (value, property) => ({
    state: true,
    return: property ? new Date().toString() : value,
    update: true
  }),
  required: (value, property) => (property ? {state: isDateTime(value) && value != undefined && value != null} : {state : true}),
}

module.exports = {
  Properties,
  Validators
}
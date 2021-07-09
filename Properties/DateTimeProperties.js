const { isDateTime, isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "dateTime",
  required: isBoolean,
  updateDate: isBoolean,
}

const Validator = {
  type: value => ({state: isDateTime(value)}),
  required: (value, property) => (property ? {state: isDateTime(value)} : {state : true}),
  updateDate: (value, property) => ({
    state: true, 
    return: property ? new Date().toString() : value 
  })
}

module.exports = {
  Properties,
  Validator
}
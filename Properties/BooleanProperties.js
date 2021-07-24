const { isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "boolean",
  default: isBoolean,
  required: isBoolean
}

const Validators = {
  type: value => ({state: isBoolean(value) || value == null }),
  default: (value, property) => ({
    state: true, 
    return: property(value)
  }),
  required: (value, property) => (property ? {state: isBoolean(value) && value != undefined && value != null} : {state : true}),
}

module.exports = {
  Properties,
  Validators
}
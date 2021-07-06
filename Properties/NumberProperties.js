const { isInt, isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "number",
  default: isBoolean,
  required: isBoolean,
  minSize: isInt,
  maxSize: isInt,
}

const Validator = {
  default: (value, property) => ({ 
    state: isInt(value) && value !== NaN,
    return: property,
  }),
  required: value => { state: isInt(value) && value !== NaN },
  minSize: (value, property) => { state: value >= property },
  maxSize: (value, property) => { state: value <= property },
}

module.exports = {
  Properties,
  Validator
}
const { isInt, isString, isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "string",
  default: isString,
  required: isBoolean,
  minLength: isInt,
  maxLength: isInt,
}

const Validators = {
  type: value => { state: isString(value) },
  default: (value, property) => value == null || value === "" ? {
    state: true,
    return: property
  } : { state: true },
  required: value => { state: !(value === "" || !isString(value)) },
  minLength: (value, property) => { state: value.length >= property },
  maxLength: (value, property) => { state: value.length <= property },
}

module.exports = {
  Properties,
  Validators
}

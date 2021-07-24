const { isInt, checkType, isType, isArray, isBoolean, isFunction } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "array",
  transform: value => isFunction(value) && isArray(value(["test"])),
  elementType: isType,
  default: isArray,
  required: isBoolean,
  minLength: isInt,
  maxLength: isInt,
}

const Validators = {
  type: value => ({ state: isArray(value) || value == null }),
  transform: (value, property) => ({state: true, return: property(value)}),
  default: (value, property) => (value == null || value === "" ? {
    state: true,
    return: property
  } : { state: true }),
  elementType: (value, property) => (property ? {state: checkType(property, value)} : {state: false}),
  required: (value, property) => (property ? { state: isArray(value) && value.length !== 0 } : {state: true}),
  minLength: (value, property) => ({ state: value.length >= property }),
  maxLength: (value, property) => ({ state: value.length <= property }),
}

module.exports = {
  Properties,
  Validators
}

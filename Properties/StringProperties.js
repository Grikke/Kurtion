const { isInt, isString, isBoolean, isFunction, toFunction } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "string",
  transform: value => isFunction(value) && isString(value("test")),
  default: isString,
  unique: isBoolean,
  required: isBoolean,
  minLength: isInt,
  maxLength: isInt,
  uppercase: isBoolean,
  lowercase: isBoolean,
}

const Validators = {
  type: value => ({ state: isString(value) }),
  transform: (value, property) => ({state: true, return: toFunction(property, value)}),
  default: (value, property) => (value == null || value === "" ? {
    state: true,
    return: property
  } : { state: true }),
  unique: (value, property, object, fieldName) => (property ? 
    { state: object.findData({[fieldName]: value}).length === 0} 
  : { state: true }),
  required: (value, property) => (property ? { state: !(value === "" || !isString(value)) } : {state: true}),
  minLength: (value, property) => ({ state: value.length >= property }),
  maxLength: (value, property) => ({ state: value.length <= property }),
  uppercase: (value, property) => ({ state: true, return: property ? value.toUpperCase() : value }),
  lowercase: (value, property) => ({ state: true, return: property ? value.toLowerCase() : value })
}

module.exports = {
  Properties,
  Validators
}

const { isInt, checkType, isType, isObject, isBoolean, isFunction } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "object",
  transform: value => isFunction(value) && isArray(value(["test"])),
  elementType: isType,
  structure: isObject,
  default: isObject,
  required: isBoolean,
  minLength: isInt,
  maxLength: isInt,
}

const Validators = {
  type: value => ({ state: isObject(value) || value == null }),
  transform: (value, property) => ({state: true, return: property(value)}),
  default: (value, property) => (value == null || value === "" ? {
    state: true,
    return: property
  } : { state: true }),
  elementType: (value, property) => (property ? {state: checkType(property, value)} : {state: true}),
  structure: (value, property) => (property ? {state: value.filter((e, key) => property[key] !== undefined).count() === value.count() && value.count() === property.count()} : {state: true}),
  required: (value, property) => (property ? { state: isArray(value) && value.length !== 0 } : {state: true}),
  minLength: (value, property) => ({ state: value.count() >= property }),
  maxLength: (value, property) => ({ state: value.count() <= property }),
}

module.exports = {
  Properties,
  Validators
}
const { isInt, isBoolean, isFunction, toFunction } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "number",
  transform: value => isFunction(value) && isInt(value(9)),
  default: value => typeof value === "number",
  autoIncrement: isBoolean,
  unique: isBoolean,
  required: isBoolean,
  minSize: isInt,
  maxSize: isInt,
}

const Validators = {
  type: value => ({ 
    state: isInt(value) || value == null || value === NaN, 
    return: ((isInt(value) && typeof value !== "number") || value === null || value === NaN ) ? 
    parseInt(value) : value
  }),
  transform: (value, property) => ({state: true, return: toFunction(property, value)}),
  default: (value, property) => ({ 
    state: true,
    return: isInt(value) ? value : property,
  }),
  autoIncrement: (v, property, object, fieldName) => (property ? 
    { state: true, return:  object.autoIncrement(fieldName) } 
  : { state: true }),
  unique: (value, property, object, fieldName) => (property ? 
    { state: object.findData({[fieldName]: value}).length === 0} 
  : { state: true }),
  required: (value, property) => (property ? { state: isInt(value) } : { state: true }),
  minSize: (value, property) => ({ state: value >= property }),
  maxSize: (value, property) => ({ state: value <= property }),
}

module.exports = {
  Properties,
  Validators
}
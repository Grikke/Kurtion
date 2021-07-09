const { isInt, isBoolean } = require("./PropertiesMethods")

const Properties = {
  type: value => value === "number",
  default: isBoolean,
  required: isBoolean,
  minSize: isInt,
  maxSize: isInt,
}

const Validators = {
  type: value => ({ 
    state: isInt(value), 
    return: (isInt(value) && typeof value !== "number") ? 
    parseInt(value) : value
  }),
  default: (value, property) => ({ 
    state: true,
    return: isInt(value) ? value : property,
  }),
  required: (value, property) => (property ? { state: isInt(value) && value !== NaN } : { state: true }),
  minSize: (value, property) => ({ state: value >= property }),
  maxSize: (value, property) => ({ state: value <= property }),
}

module.exports = {
  Properties,
  Validators
}
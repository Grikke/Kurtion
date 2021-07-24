const methods = {
  isInt: v => parseInt(v) !== NaN && parseInt(v) == v,
  isString: v => typeof v === "string",
  isBoolean: v => typeof v === "boolean",
  isArray: v => typeof v === "object" && v instanceof Array,
  isObject: v => typeof v === "object" && !(v instanceof Array),
  isFunction: v => typeof v === "function",
  isDateTime: v => new Date(v).getDate() !== NaN,
  isType: v => Types[v] != undefined,
  checkType: (v, c) => c.filter(e => Types[v](e)).length === c.length
}

const Types = {
  string: methods.isString,
  number: methods.isInt,
  boolean: methods.isBoolean,
  array: methods.isArray,
  object: methods.isObject,
  dateTime: methods.isDateTime,
}

module.exports = methods
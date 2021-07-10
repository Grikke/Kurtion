module.exports = {
    isInt: v => parseInt(v) !== NaN && parseInt(v) == v,
    isString: v => typeof v === "string",
    isBoolean: v => typeof v === "boolean",
    isFunction: v => typeof v === "function",
    isDateTime: v => new Date(v).getDate() !== NaN
}
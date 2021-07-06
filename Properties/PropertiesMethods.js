module.exports = {
    isInt: value => parseInt(value) !== NaN && parseInt(value) == value,
    isString: value => typeof value === "string",
    isBoolean: value => typeof value === "boolean"
}
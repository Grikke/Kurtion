Object.prototype.forEach = function(func) {
  Object.keys(this).forEach(key => {
    func(key, this[key])
  })
}
Object.prototype.count = function() {
  return Object.keys(this).length
}
Object.prototype.filter = function(func) {
  let obj = this
  Object.keys(this).filter(key => {
    if (!(func(key, this[key]))) {
      delete obj[key]
    }
  })
  return obj
}
String.prototype.ucfirst = function() {
  return `${this.charAt(0).toUpperCase()}${this.slice(1)}`
}
String.prototype.lcfirst = function() {
  return `${this.charAt(0).toLowerCase()}${this.slice(1)}`
}

const DatabaseReader = require("./Methods/DatabaseReader")
const TableManager = require("./Methods/TableManager")

module.exports = ({
  name,
  location
}) => {
  return {
    ...DatabaseReader.constructor(location, name),
    Table: ({
      name,
      properties
    }) => {
      DatabaseReader.createTable(name, properties)
      let table = Object.create(TableManager)
      table.constructor(location, name)
      return table
    }
  }
}
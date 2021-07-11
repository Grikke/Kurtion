Object.prototype.forEach = function(func) {
  Object.keys(this).forEach(key => {
    func(key, this[key])
  })
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
    Table: ({
      name,
      properties
    }) => {
      this.createTable(name, properties)
      return new TableManager(location, name)
    },
    ...new DatabaseReader(location, name)
  }
}
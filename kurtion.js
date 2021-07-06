Object.prototype.forEach = function(func) {
  Object.keys(this).forEach(key => {
    func(key, this[key])
  })
}
String.prototype.lcfirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// const DatabaseReader = require("./Methods/DatabaseReader")

// let required = true
// let Data = new DatabaseReader()
// Data.createTable("User", {
//   id: {
//     required,
//     type: "number"
//   },
//   pseudo: {
//     required,
//     type: "string",
//     minLength: 4,
//     maxLength: 20
//   },
// })
// const TableManager = require("./Methods/TableManager")
// let Table = new TableManager("/ECMAData", "User")

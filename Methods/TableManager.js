const fs = require("file-system")
const DatabaseReader = require("./DatabaseReader")

class TableManager {
  constructor(location, tableName) {
    this.tableName = tableName
    this.location = "./"+(typeof location === "string" ? location.trim() : "/ECMAData")
    this.checkTable()
    this.properties = this.getTableConfig()
    console.log(this.properties)
  }
  getTableConfig() {
    let DB = new DatabaseReader(this.location, "", false), properties
    if (properties = DB.readTablesConfig().tables[this.tableName])
      return properties;
  }
  checkTable() {
    return fs.existsSync(`${this.location}/${this.tableName}.json`)
  }
}

module.exports = TableManager
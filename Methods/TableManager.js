const fs = require("file-system")
const DatabaseReader = require("./DatabaseReader")

class TableManager {
  constructor(location, tableName) {
    this.tableName = tableName
    this.location = "./"+(typeof location === "string" ? location.trim() : "/ECMAData")
    this.DB = new DatabaseReader(this.location, "", false)
    this.checkTable()
  }
  getPropValidators(type) {
    try {
      return require(`../Properties/${type.ucfirst()}Properties`).Validators
    }
    catch {
      console.error(`Unknow specified type : ${type}`)
    }
  }
  getTable() {
    if (fs.existsSync(`${this.location}/${this.tableName}.json`)) {
      return JSON.parse(fs.readFileSync(`${this.location}/${this.tableName}.json`, {
        encoding: "utf-8"
      }))
    }
    else {
      fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify([]))
      return []
    }
  }
  autoIncrement(fieldName) {
    let table = this.getTable()
    let highNumber = 0
    table.forEach(tableObj => {
      highNumber = highNumber <= tableObj[fieldName] ? tableObj[fieldName] : highNumber
    })
    return highNumber + 1
  }
  findData(findData) {
    let table = this.getTable()
    let array = []
    table.forEach(tableObj => {
      findData.forEach((findKey, findValue) => {
        if (typeof tableObj[findKey] === "string") {
          if (tableObj[findKey].match(findValue))
            array = [...array, tableObj]
        }
        else if (tableObj[findKey] === findValue)
          array = [...array, tableObj]
      })
    })
    return array
  }
  insertData(Data) {
    let tabData = this.getTableConfig()
    let data = {}, valid = true;
    tabData.forEach((fieldName) => {
      let validator
      if (validator = this.getPropValidators(tabData[fieldName].type)) {
        let columnIsValid = true
        let dataValue = Data[fieldName]
        validator.forEach((property, func) => {
          if (columnIsValid && tabData[fieldName][property]) {
            let checkProp = func(dataValue, tabData[fieldName][property], this, fieldName)
            columnIsValid = checkProp.state
            if (!checkProp.state)
              console.error(`Field "${fieldName.ucfirst()}" is not valid with the "${property}" property`)
            dataValue = checkProp.return ? checkProp.return : dataValue
          }
        })
        if (columnIsValid)
          data = {...data, [fieldName]: dataValue}
        else valid = false
      }
      else valid = false
    })
    if (valid) {
      let table = [ ...this.getTable(), data]
      fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify(table))
    }
  }
  getTableConfig() {
    let properties
    if (properties = this.DB.readTablesConfig().tables[this.tableName])
      return properties
    else
      console.error(`"${this.tableName}" don't seem to have been created`)
  }
  checkTable() {
    try {
      fs.existsSync(`${this.location}/${this.tableName}.json`)
      this.getTableConfig()
    }
    catch {
      console.error(`Table "${this.tableName}" or location could not be found`)
    }
  }
}

module.exports = TableManager
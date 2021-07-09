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
    return JSON.parse(fs.readFileSync(`${this.location}/${this.tableName}.json`, {
      encoding: "utf-8"
    }))
  }
  findData(findData) {
    
  }
  insertData(Data) {
    let required = this.getRequiredFields()
    let data = {}, valid = true;
    Data.forEach((fieldName, fieldValue) => {
      let findIndex = required.find(field => field === fieldName)
      let validator, prop
      if (findIndex !== -1) required.splice(findIndex, 1)
      if (prop = this.getTableConfig()[fieldName]) {
        validator = this.getPropValidators(prop.type)
        let columnIsValid = true
        let dataValue = fieldValue
        prop.forEach((property, propValue) => {
          if (columnIsValid) {
            let checkProp = validator[property](fieldValue, propValue)
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
    if (required.length === 0 && valid) {
      let table = [ ...this.getTable(), data]
      fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify(table))
    }
  }
  getRequiredFields() {
    let required = []
    this.getTableConfig().forEach((columnName, properties) => {
      if (properties.required) required = [...required, columnName]
    })
    return required;
  }
  getTableConfig() {
    let properties
    if (properties = this.DB.readTablesConfig().tables[this.tableName])
      return properties
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
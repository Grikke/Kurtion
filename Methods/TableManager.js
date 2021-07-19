const fs = require("file-system")
const DatabaseReader = require("./DatabaseReader")

module.exports = {
  constructor: function(location, tableName) {
    this.tableName = tableName
    let isString = typeof location === "string"
    this.location = (isString && location.trim().startsWith('./') ? "" : "./")+(isString ? location.trim() : "/ECMAData")
    this.DB = DatabaseReader.constructor(this.location, "", false)
    this.checkTable()
    return this
  },
  getPropValidators: function(type) {
    try {
      return require(`../Properties/${type.ucfirst()}Properties`).Validators
    }
    catch {
      console.error(`Unknow specified type : ${type}`)
    }
  },
  getTable: function() {
    if (fs.existsSync(`${this.location}/${this.tableName}.json`)) {
      return JSON.parse(fs.readFileSync(`${this.location}/${this.tableName}.json`, {
        encoding: "utf-8"
      }))
    }
    else {
      fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify([]))
      return []
    }
  },
  autoIncrement: function(fieldName) {
    let table = this.getTable()
    let highNumber = 0
    table.forEach(tableObj => {
      highNumber = highNumber <= tableObj[fieldName] ? tableObj[fieldName] : highNumber
    })
    return highNumber + 1
  },
  findData: function(findData) {
    let table = this.getTable()
    let array = []
    if (!Array.isArray(findData)) findData = [findData]
    findData.forEach(data => {
      data.forEach((findKey, findValue) => {
        table.forEach(tableObj => {
          if (typeof tableObj[findKey] === "string") {
            if (tableObj[findKey].match(findValue))
              array = [...array, tableObj]
          }
          else if (tableObj[findKey] === findValue)
            array = [...array, tableObj]
        })
      })
    })
    return array
  },
  removeData: function(findData) {
    let table = this.getTable()
    if (!Array.isArray(findData)) findData = [findData]
    findData.forEach(data => {
      data.forEach((findKey, findValue) => {
        table = table.filter(tableObj => {
          if (typeof tableObj[findKey] === "string")
            return !tableObj[findKey].match(findValue)
          else return tableObj[findKey] !== findValue
        })
      })
    })
    fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify(table))
  },
  updateData: function(findData, updateData) {
    let tabData = this.getTableConfig()
    let table = this.getTable()
    let valid = true
    if (!Array.isArray(findData)) findData = [findData]
    findData.forEach(data => {
      data.forEach((findKey, findValue) => {
        table.forEach((tableObj, tableIndex) => {
          let data = {...tableObj}
          if (typeof tableObj[findKey] === "string") {
            if (tableObj[findKey].match(findValue)) {
              tabData.forEach((fieldName) => {
                let validator
                if (validator = this.getPropValidators(tabData[fieldName].type)) {
                  let dataValue = updateData[fieldName] ?? tableObj[fieldName]
                  validator.forEach((property, func) => {
                    if (valid && tabData[fieldName][property]) {
                      let checkProp = func(dataValue, tabData[fieldName][property], this, fieldName)
                      valid = checkProp.state || (property === "unique" && dataValue === tableObj[findKey])
                      if (!valid)
                        console.error(`Field "${fieldName.ucfirst()}" is not valid with the "${property}" property`)
                      dataValue = checkProp.return && checkProp.update ? checkProp.return : dataValue
                    }
                    if (valid) {
                      data = {...data, [fieldName]: dataValue}
                      table[tableIndex] = data
                    }
                    else valid = false
                  })
                }
                else valid = false
            })
          }
        }
        else if (tableObj[findKey] === findValue) {
          tabData.forEach((fieldName) => {
            let validator 
            if (validator = this.getPropValidators(tabData[fieldName].type)) {
              let dataValue = updateData[fieldName] ?? tableObj[fieldName]
              validator.forEach((property, func) => {
                if (valid && tabData[fieldName][property]) {
                  let checkProp = func(dataValue, tabData[fieldName][property], this, fieldName)
                  valid = checkProp.state || (property === "unique" && dataValue === tableObj[findKey])
                  if (!valid)
                    console.error(`Field "${fieldName.ucfirst()}" is not valid with the "${property}" property`)
                  dataValue = checkProp.return && checkProp.update ? checkProp.return : dataValue
                }
                if (valid) {
                  data = {...data, [fieldName]: dataValue}
                  table[tableIndex] = data
                }
                else valid = false
                })
              }
              else valid = false
            })
          }
        })
      })
    })
    if (valid) {
      fs.writeFileSync(`${this.location}/${this.tableName}.json`, JSON.stringify(table))
    }
  },
  insertData: function(Data) {
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
  },
  getTableConfig: function() {
    let properties
    if (properties = this.DB.readTablesConfig().tables[this.tableName])
      return properties
    else
      console.error(`"${this.tableName}" don't seem to have been created`)
  },
  checkTable: function() {
    try {
      fs.existsSync(`${this.location}/${this.tableName}.json`)
      this.getTableConfig()
    }
    catch {
      console.error(`Table "${this.tableName}" or location could not be found`)
    }
  }
}
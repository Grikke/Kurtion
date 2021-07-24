const { stateError: Error, stateSuccess: Success } = require("./StateReturn")
const fs = require("file-system")

module.exports = {
  constructor: function(location, name, create=true) {
    let isString = typeof location === "string"
    this.location = (typeof location === "string" && location.trim().startsWith('./') ? "":"./")+(isString ? location.trim() : "/ECMAData")
    if (create) {
      this.name = typeof name === "string" ? name.trim() : "ECMAData"
      let creation = this.createDatabaseFolder()
      if (creation?.state === false)
        return creation
    }
    return this
  },
  createDatabaseFolder: function() {
    try {
      if (fs.existsSync(this.location)) {
        this.readTablesConfig()
      }
      else {
        fs.mkdirSync(this.location)
        if (fs.existsSync(this.location)) {
          this.writeTablesConfig()
        }
        else return Error("Cannot create the directory")
      }
    }
    catch (e) { return Error("Wrong path or name", e) }
  },
  readTablesConfig: function() {
    try {
      let config = JSON.parse(fs.readFileSync(this.location+"/config.json", {
        encoding: "utf-8"
      }))
      if (typeof config === "object" && typeof config.name === "string" && typeof config.tables === "object")
        return this.config = config
      return Error("Config file is wrong")
    }
    catch (e) { return Error("Config file is wrong", e) }
  },
  writeTablesConfig: function() {
    try {
      let config = {
        name: this.name,
        tables: {}
      }
      fs.writeFileSync(this.location+"/config.json", JSON.stringify(config))
      if (fs.existsSync(this.location+"/config.json"))
        return this.config = config
      return Error("Config file cannot be created")
    }
    catch (e) { return Error("Config file cannot be created", e) }
  },
  getConfig: function() {
    return this.config
  },
  setConfig: function(config) {
    this.config = config
  },
  getPropSpecs: function(type) {
    try {
      return require(`../Properties/${type.ucfirst()}Properties`).Properties
    }
    catch (e) {
      return Error(`Unknow specified type : ${type}`, e)
    }
  },
  createTable: function(tableName, columns) {
    let tables = this.getConfig().tables
    let breaking = false;
    let error = ''
    if (!tables[tableName]) {
      let tableColumns = {}
      columns.forEach((columnName, properties) => {
        if (!properties.type) {
          error = `No type specified for "${columnName}"`
          breaking = true
          return
        }
        let Spec = this.getPropSpecs(properties.type)
        if (Spec) {
          properties.forEach((attribute, attrVal) => {
            if (!Spec[attribute](attrVal)) {
              error = `Wrong attributes for property "${attribute}"`
              breaking = true
              return
            }
          })
          if (!breaking) {
            tableColumns = {
              ...tableColumns,
              [columnName]: properties
            }
          }
        }
        else breaking = true
      });
      if (!breaking) {
        tables = {
          ...tables,
          [tableName]: tableColumns
        }
        this.config.tables = tables;
        fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
        fs.writeFileSync(`${this.location}/${tableName}.json`, JSON.stringify([]))
        return Success({[tableName]: tableColumns})
      }
      else return Error(error)
    }
    else return Error('Table already exist')
  },
  removeTable: function(tableName) {
    delete this.config.tables[tableName]
    try {
      fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
      return Success(this.getConfig())
    }
    catch (e) { return Error(`Cannot remove table "${tableName}"`, e) }
  },
  insertColumn: function(tableName, columns) {
    let tables = this.getConfig().tables
    let breaking = false
    let error = ''
    if (tables[tableName]) {
      let tableColumns = {}
      columns.forEach((columnName, properties) => {
        if (!properties.type) {
          error = `No type specified for "${columnName}"`
          breaking = true
          return
        }
        let Spec = this.getPropSpecs(properties.type)
        if (Spec) {
          properties.forEach((attribute, attrVal) => {
            if (!Spec[attribute](attrVal)) {
              error = `Wrong attributes for property "${attribute}"`
              breaking = true
              return
            }
          })
          if (!breaking) {
            tableColumns = {
              ...tableColumns,
              [columnName]: properties
            }
          }
        }
        else breaking = true
      });
      if (!breaking) {
        tables = {
          ...tables,
          [tableName]: {
            ...tables[tableName], 
            ...tableColumns
          }
        }
        this.config.tables = tables;
        fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
        return Success(this.getConfig())
      }
      else return Error(error)
    }
    else return Error(`Table "${tableName}" didn't exist`)
  },
  updateColumn: function(tableName, columnName, columnProps) {
    let tableConfig = this.getConfig().tables[tableName][columnName]
    let prop = {}, isValid = true
    let Spec = this.getPropSpecs(tableConfig.type)
    let error = ''
    columnProps.forEach((propName, propValue) => {
      if (Spec[propName](propValue))
        prop = { ...prop, [propName]: propValue }
      else { 
        isValid = false
        error = `Property ${propName} is not valid`
      }
    })
    if (isValid) {
      this.config.tables[tableName][columnName] = {
        ...tableConfig,
        ...prop
      }
      fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
      return Success(this.getConfig())
    }
    else return Error(error)
  },
  removeColumn: function(tableName, arrayColumn) {
    let tablesConfig = this.getConfig().tables
    if (typeof arrayColumn === "string") arrayColumn = [arrayColumn]
    let table = JSON.parse(fs.readFileSync(`${this.location}/${tableName}.json`, {encoding: 'utf-8'}))
    if (tablesConfig[tableName]) {
      arrayColumn.forEach(columnName => {
        table.forEach((t, index) => {
          delete table[index][columnName]
        })
        fs.writeFileSync(`${this.location}/${tableName}.json`, JSON.stringify(table))
        if (!this.getConfig().tables[tableName][columnName])
          console.error(`Column "${columnName}" didn't exist`)
        delete this.getConfig().tables[tableName][columnName]
      })
      fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
      return Success(this.getConfig())
    }
    else return Error(`Table "${tableName}" didn't exist`)
  }
}
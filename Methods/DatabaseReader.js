const fs = require("file-system")

class DatabaseReader {
  constructor(location, name, create=true) {
    this.location = "./"+(typeof location === "string" ? location.trim() : "/ECMAData")
    if (create) {
      this.name = typeof location === "string" ? name.trim() : "ECMAData"
      this.#createDatabaseFolder()
    }
  }
  #createDatabaseFolder() {
    try {
      let config
      if (fs.existsSync(this.location)) {
        if (config = this.readTablesConfig())
          this.config = config
      }
      else {
        fs.mkdirSync(this.location)
        if (fs.existsSync(this.location)) {
          if (config = this.writeTablesConfig())
            this.config = config
        }
        else console.error("Cannot create the directory")
      }
    }
    catch { console.error("Wrong path or name") }
  }
  readTablesConfig() {
    let config = JSON.parse(fs.readFileSync(this.location+"/config.json", {
      encoding: "utf-8"
    }))
    if (typeof config === "object" && typeof config.name === "string" && typeof config.tables === "object")
      return config
    else { 
      console.error("Config file is wrong")
      return false
    }
  }
  writeTablesConfig() {
    let config = {
      name: this.name,
      tables: {}
    }
    fs.writeFileSync(this.location+"/config.json", JSON.stringify(config))
    if (fs.existsSync(this.location+"/config.json"))
      return config
    else {
      console.error("Config file cannot be created")
      return false
    }
  }
  getConfig() {
    return this.config
  }
  setConfig(config) {
    this.config = config
  }
  getPropSpecs(type) {
    try {
      return require(`../Properties/${type.ucfirst()}Properties`).Properties
    }
    catch {
      console.error(`Unknow specified type : ${type}`)
    }
  }
  createTable(tableName, columns) {
    let tables = this.getConfig().tables
    let breaking = false;
    if (!tables[tableName]) {
      let tableColumns = {}
      columns.forEach((columnName, properties) => {
        if (!properties.type) {
          console.error(`No type specified for "${columnName}"`)
          breaking = true
          return
        }
        let Spec = this.getPropSpecs(properties.type)
        if (Spec) {
          properties.forEach((attribute, attrVal) => {
            if (!Spec[attribute](attrVal)) {
              console.error(`Wrong attributes for property "${attribute}"`)
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
      }
    }
  }
  removeTable(tableName) {
    delete this.config.tables[tableName]
    try {
      fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
    }
    catch {
      console.error(`Cannot remove table "${tableName}"`)
    }
  }
  insertColumn(tableName, columns) {
    let tables = this.getConfig().tables
    let breaking = false
    if (tables[tableName]) {
      let tableColumns = {}
      columns.forEach((columnName, properties) => {
        if (!properties.type) {
          console.error(`No type specified for "${columnName}"`)
          breaking = true
          return
        }
        let Spec = this.getPropSpecs(properties.type)
        if (Spec) {
          properties.forEach((attribute, attrVal) => {
            if (!Spec[attribute](attrVal)) {
              console.error(`Wrong attributes for property "${attribute}"`)
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
      }
    }
    else console.error("Table didn't exist")
  }
  updateColumn(tableName, columnName, columnProps) {
    let tableConfig = this.getConfig().tables[tableName][columnName]
    let prop = {}, isValid = true
    let Spec = this.getPropSpecs(tableConfig.type)
    columnProps.forEach((propName, propValue) => {
      if (Spec[propName](propValue))
        prop = { ...prop, [propName]: propValue }
      else { 
        isValid = false
        console.error(`Property ${propName} is not valid`)
      }
    })
    if (isValid) {
      this.config.tables[tableName][columnName] = {
        ...tableConfig,
        ...prop
      }
      fs.writeFileSync(`${this.location}/config.json`, JSON.stringify(this.getConfig()))
    }
  }
  removeColumn(tableName, arrayColumn) {
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
    }
    else console.error("Table didn't exist")
  }
}

module.exports = DatabaseReader
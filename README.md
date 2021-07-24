# Kurtion

[![NPM](https://nodei.co/npm/kurtion.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/kurtion/)

## Installation
With Shell Console

```sh
npm i kurtion
```

## First Step

```js
const Kurtion = require('kurtion')({
  name: /* name of your project, if not set ECMAData is the default */,
  location: /* location of your project, if not set ./ECMAData is the default */
})
```
To Create a Table and Manage it (User in the example)
```js
const User = Kurtion.Table({
  name: "User" /* name of your table */,
  properties: {
    id: {
      type: "number",
      autoIncrement: true,
      unique: true,
    },
    pseudo: {
      type: "string",
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    created_at: {
      type: "dateTime",
      createDate: true,
    },
    updated_at: {
      type: "dateTime",
      updateDate: true,
    }
  } /* object columns with properties, can be updated later */
})
User.insertData({
  pseudo: "grikke",
  password: "securedPassword",
}) /* create an user with the example */
```

# Documentation

## Methods

### Return Statement

Success Statement
```js
{
  state: true,
  response: /* object or array if data is expected or simple string message */
}
```
Error Statement
```js
{
  state: false,
  message: /* Specific error message */,
  error: /* error object, can be empty */
}
```

### Table

- .autoIncrement(fieldName)
Get the highest value of a field by name

- .findData(findData)
Find data with array of object
```js
User.findData([{
  id: 3
}, {
  id: 4
}]) /* return empty array */
```

- .removeData(findData)
Find data and remove it with the same array of object as .findData

- .updateData(findData, updateData)
Find data and update field
```js
User.updateData({ id: 1}, {
  pseudo: "Karl"
})
```

- .insertData(Data)
Insert Data in the table

### Database

- .createTable(tableName, properties)
Create a table as the exemple above

- .removeTable(tableName)
Remove a Table by Name

- .insertColumn(tableName, properties)
Insert a Column into table

- .updateColumn(tableName, columnName, columnProps)
Update a Column with new properties

- .removeColumn(tableName, arrayColumn)
Remove a column and column's data in Table with an array of column
```js
Kurtion.removeColumn("User", [
  "created_at",
  "password",
])
```

### Types

- *Common*
  * required: Is required for validation 
    -> Property type : boolean
  * transform: Transform the value as you wish (function required) except for boolean 
    -> Property type : function

- string
  * default : Default value for the column (if not set) 
    -> Property type : string
  * unique: Unique value for each column value 
    -> Property type : boolean
  * minLength: Minimum length for the string 
    -> Property type : number
  * maxLength: Maximum length for the string 
    -> Property type : number
  * uppercase: transform string to uppercase only 
    -> Property type : boolean
  * lowercase: transform string to lowercase only 
    -> Property type : boolean

- array
  * default : Default value for the column (if not set) 
    -> Property type : array
  * elementType: Specify if you want specific element type (string for example) 
    -> Property type : string (type)
  * minLength: Minimum length for the array 
    -> Property type : number
  * maxLength: Maximum length for the array 
    -> Property type : number

- object
  * default : Default value for the column (if not set) 
    -> Property type : object
  * elementType: Specify if you want specific element type (string for example) 
    -> Property type : string (type)
  * structure: Check that the object contains all key no more, no less 
    -> Property type : object (only key will be check)
  * minLength: Minimum length for the object 
    -> Property type : number
  * maxLength: Maximum length for the object 
    -> Property type : number

- number
  * default : Default value for the column (if not set) 
    -> Property type : number
  * unique: Unique value for each column value 
    -> Property type : boolean
  * autoIncrement: auto-increment number based on the field (useful for id) 
    -> Property type : boolean
  * minSize: Minimum number 
    -> Property type : number
  * maxSize: Maximum number 
    -> Property type : number

- dateTime
  * updateDate: update date column when editing or inserting 
    -> Property type : boolean
  * createDate: create date column when inserting 
    -> Property type : boolean

- boolean
  * default : Default value for the column (if not set) 
    -> Property type : boolean
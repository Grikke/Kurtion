# Kurtion

## Installation
With Shell Console

```sh
git clone git@github.com:Grikke/Kurtion.git
cd Kurtion
npm install
npm start
```

To try the package, don't forget to uncomment the example code.

## Documentation

### Types

- Common
  * required: Is required for validation
  * transform: Transform the value as you wish

- string
  * default : Default value for the column (if not set)
  * unique: Unique value for each column value
  * minLength: Minimum length for the string
  * maxLength: Maximum length for the string
  * uppercase: transform string to uppercase only
  * lowercase: transform string to lowercase only 

- number
  * default : Default value for the column (if not set)
  * unique: Unique value for each column value
  * autoIncrement: auto-increment number based on the field (useful for id)
  * minSize: Minimum number
  * maxSize: Maximum number

- dateTime
  * updateDate: update date column when editing or creating
# DynamoDB MongoDB Migrate
[![Build Status](https://travis-ci.org/shoutout-labs/dynamodb-mongodb-migrate.svg?branch=master)](https://travis-ci.org/shoutout-labs/dynamodb-mongodb-migrate)

Data migration module for migrating dynamodb tables to mongodb db collections

## Installing

```shell
npm install dynamodb-mongodb-migrate
```

## Quick Usage

```shell
const MigrationJob = require('dynamodb-mongodb-migrate');

const migrationJob = new MigrationJob('DYNAMODB_TABLE_NAME', 'MONGODB_COLLECTION_NAME', 'MONGODB_DATABASE_NAME', DYNAMODB_SCAN_LIMIT, DYNAMODB_READ_THROUGHPUT);

migrationJob.run()
```

## Adavance Usage

```javascript
const MigrationJob = require('dynamodb-mongodb-migrate');

const migrationJob = new MigrationJob('DYNAMODB_TABLE_NAME', 'MONGODB_COLLECTION_NAME', 'MONGODB_DATABASE_NAME', DYNAMODB_SCAN_LIMIT, DYNAMODB_READ_THROUGHPUT);
```

### Setting dynamodb filter expression - filter when scanning dynamodb

```javascript
const filterExpression = '#attr1 = :val1';
const expressionAttributeNames = {
    '#attr1':'attribute1'
};
const expressionAttributeValues = {
    ':val1':'value1'
}
migrationJob.setSourcefilterExpression(filterExpression, expressionAttributeNames, expressionAttributeValues);
```

### Setting data filter function - filter after scan result - similar to lodash filter

```javascript
const filterFunction = (item) =>{
    return item.attr1 !== null;
}

migrationJob.setMapperFunction(filterFunction);
```

### Setting data mapper function - similar to lodash map

```javascript
const mapperFunction = (item) =>{
    return {
        mappedAttr1 : item.attr1,
        mappedAttr2 : item.attr2
    }
}

migrationJob.setMapperFunction(mapperFunction);

migrationJob.run()
```

## Testing

```shell
npm test
```

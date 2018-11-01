'use strict';
const lodash = require('lodash');
const DynamoDBDAO = require('./dao/DynamoDBDAO');
const MongoDBDAO = require('./dao/MongoDBDAO');

class MigrationJob {
    constructor(sourceTableName, targetTableName, targetDbName, dynamodbEvalLimit) {
        this.sourceTableName = sourceTableName;
        this.targetTableName = targetTableName;
        this.targetDbName = targetDbName;
        this.mapperFunction = (item) => { return item; };
        this.dynamoDBDAO = new DynamoDBDAO(sourceTableName);
        this.mongoDBDAO = new MongoDBDAO(this.targetTableName, this.targetDbName);
        this.dynamodbEvalLimit = dynamodbEvalLimit || 100;
        this.filterExpression = null;
        this.expressionAttributeNames = null;
        this.expressionAttributeValues = null;
    }

    setMapper(mapperFunction) {
        this.mapperFunction = mapperFunction
    }

    setSourcefilterExpression(filterExpression, expressionAttributeNames, expressionAttributeValues) {
        this.filterExpression = filterExpression;
        this.expressionAttributeNames = expressionAttributeNames;
        this.expressionAttributeValues = expressionAttributeValues;
    }

    run() {
        let ctx = this;
        return new Promise(async (resolve, reject) => {
            try {
                let lastEvalKey;
                do {
                    let sourceItemResponse = await ctx.dynamoDBDAO.scan(ctx.filterExpression,ctx.expressionAttributeNames, ctx.expressionAttributeValues, lastEvalKey, ctx.dynamodbEvalLimit);
                    console.log('Received item count : ', sourceItemResponse.Count);
                    let sourceItems = sourceItemResponse && sourceItemResponse.Items ? sourceItemResponse.Items : [];
                    let targetItems = lodash.map(sourceItems, ctx.mapperFunction);
                    if (targetItems.length > 0) {
                        let results = await ctx.mongoDBDAO.intertOrUpdateItems(targetItems);
                        console.log('Modified mongodb doc count : ', results.modifiedCount);
                        console.log('Inserted mongodb doc count : ', results.upsertedCount);
                    }
                    if (sourceItemResponse && sourceItemResponse.LastEvaluatedKey) {
                        lastEvalKey = sourceItemResponse.LastEvaluatedKey;
                    } else {
                        lastEvalKey = null;
                    }
                } while (lastEvalKey);
                console.log('Migration completed');
                resolve();
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }
}

module.exports = MigrationJob;
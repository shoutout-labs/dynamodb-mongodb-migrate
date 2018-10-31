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
    }

    setMapper(mapperFunction) {
        this.mapperFunction = mapperFunction
    }

    run() {
        return new Promise(async (resolve,reject)=>{
            try {
                let lastEvalKey;
                do {
                    let sourceItemResponse = await this.dynamoDBDAO.scan(null, null, null, lastEvalKey, this.dynamodbEvalLimit);
                    console.log('Received item count : ', sourceItemResponse.Count);
                    let sourceItems = sourceItemResponse && sourceItemResponse.Items ? sourceItemResponse.Items : [];
                    let targetItems = lodash.map(sourceItems, this.mapperFunction);
                    if (targetItems.length > 0) {
                        let results = await this.mongoDBDAO.intertOrUpdateItems(targetItems);
                        console.log('Updated mongodb doc count : ', results.upsertedCount);
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
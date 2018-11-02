'use strict';
const DynamoDBConnector = require('../connectors/DynamoDBConnector');

class DynamoDBDAO {
    constructor(tableName) {
        this.tableName = tableName;
        this.docClient = DynamoDBConnector.getDocumentClient();
    }

    query(keyConditionExpression, filterExp, expAttrNames, expAttrValues, indexName, projExp) {
        let ctx = this;
        return new Promise((resolve, reject) => {
            try {
                let params = {
                    TableName: this.tableName
                };
                if (keyConditionExpression) {
                    params.KeyConditionExpression = keyConditionExpression;
                }
                if (indexName) {
                    params.IndexName = indexName;
                }
                if (filterExp) {
                    params.FilterExpression = filterExp;
                }
                if (expAttrNames) {
                    params.ExpressionAttributeNames = expAttrNames;
                }
                if (expAttrValues) {
                    params.ExpressionAttributeValues = expAttrValues;
                }
                if (projExp) {
                    params.ProjectionExpression = projExp;
                }
                ctx.docClient.query(params, function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                console.error(error);
                reject(reject);
            }
        });
    }

    scan(filterExp, expAttrNames, expAttrValues,lastEvalKey, limit) {
        let ctx = this;
        return new Promise((resolve, reject) => {
            try {
                let params = {
                    TableName: this.tableName
                };
                if (filterExp) {
                    params.FilterExpression = filterExp;
                }
                if (expAttrNames) {
                    params.ExpressionAttributeNames = expAttrNames;
                }
                if (expAttrValues) {
                    params.ExpressionAttributeValues = expAttrValues;
                }
                if (limit) {
                    params.Limit = limit;
                }
                if(lastEvalKey){
                    params.ExclusiveStartKey = lastEvalKey;
                }
                params.ReturnConsumedCapacity = 'TOTAL';
                ctx.docClient.scan(params, function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                console.error(error);
                reject(reject);
            }
        });
    }
}

module.exports = DynamoDBDAO;
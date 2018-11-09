/**
 * Created by madura on 11/10/16.
 */
'use strict';

const AWS = require('aws-sdk')

class DynamoDBConnector {
    static getDocumentClient(region,accessKeyId,secretAccessKey) {
        return new AWS.DynamoDB.DocumentClient({
            region: region,
            accessKeyId:accessKeyId,
            secretAccessKey:secretAccessKey
        });
    }
}

module.exports = DynamoDBConnector;
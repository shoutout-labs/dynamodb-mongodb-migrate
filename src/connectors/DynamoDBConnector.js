/**
 * Created by madura on 11/10/16.
 */
'use strict';

const AWS = require('aws-sdk')
const config = require('./../config');

class DynamoDBConnector {
    static getDocumentClient() {
        return new AWS.DynamoDB.DocumentClient({
            region: config.AWS_REGION
        });
    }
}

module.exports = DynamoDBConnector;
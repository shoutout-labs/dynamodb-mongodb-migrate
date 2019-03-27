/**
 * Created by asankanissanka on 9/29/16.
 */
'use strict';

const MongoClient = require('mongodb').MongoClient;

let client;

class MongoDBConnector {

    static getConnection(databaseName, connectionString) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client) {
                    resolve(client.db(databaseName));
                } else {
                    client = new MongoClient(connectionString);
                    await client.connect();
                    resolve(client.db(databaseName));
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });

    }
}

module.exports = MongoDBConnector;

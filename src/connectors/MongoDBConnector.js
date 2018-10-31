/**
 * Created by asankanissanka on 9/29/16.
 */
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('./../config');
const URL = 'mongodb://' + config.MONGODB_USERNAME + ':' + config.MONGODB_PASSWORD + '@' + config.MONGODB_ENDPOINT;

let client;

class MongoDBConnector {

    static getConnection(database) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client) {
                    resolve(client.db(database));
                } else {
                    client = new MongoClient(URL,{ useNewUrlParser: true });
                    await client.connect();
                    resolve(client.db(database));
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });

    }
}

module.exports = MongoDBConnector;
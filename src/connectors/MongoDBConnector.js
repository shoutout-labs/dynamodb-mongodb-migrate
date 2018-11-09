/**
 * Created by asankanissanka on 9/29/16.
 */
'use strict';

const MongoClient = require('mongodb').MongoClient;

let client;

class MongoDBConnector {

    static getConnection(database,host,user,password) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client) {
                    resolve(client.db(database));
                } else {
                    let url = 'mongodb://' + user + ':' + password + '@' + host;
                    client = new MongoClient(url,{ useNewUrlParser: true });
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
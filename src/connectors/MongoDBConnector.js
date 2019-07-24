/**
 * Created by asankanissanka on 9/29/16.
 */
'use strict';

const MongoClient = require('mongodb').MongoClient;

let client;

class MongoDBConnector {

    static getConnection(database, targetConnectionOptions) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client) {
                    resolve(client.db(database));
                } else {
                    let url = "";
                    // Adds the option to pass the URL as a whole
                    if (targetConnectionOptions.url)
                        url = targetConnectionOptions.url;
                    else {
                        url = 'mongodb://' + targetConnectionOptions.user + ':' + targetConnectionOptions.password + '@' + targetConnectionOptions.host;
                    }
                    client = new MongoClient(url, { useNewUrlParser: true });
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
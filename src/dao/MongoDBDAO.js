'use strict';
const lodash = require('lodash');
const MongoDBConnector = require('./../connectors/MongoDBConnector');

class MongoDBDAO {
    constructor(tableName, databaseName, connectionString) {
        this.tableName = tableName;
        this.databaseName = databaseName
        this.connectionString = connectionString;
      }

    async intertOrUpdateItems(items) {
        let dbConn = await MongoDBConnector.getConnection(this.databaseName, this.connectionString);
        let collection = dbConn.collection(this.tableName);
        let bulkWriteReqArray = lodash.map(items, (item) => {
            return {
                updateOne: {
                    filter: { _id: item['_id'] },
                    update: {
                        $set: lodash.omit(item, '_id')
                    },
                    upsert: true
                }
            }
        });
        return collection.bulkWrite(bulkWriteReqArray);
    }
}

module.exports = MongoDBDAO;

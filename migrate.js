'use strict';
//loading environment variables
require('dotenv').config()
const config = require('./src/config');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    region: config.AWS_REGION
});
const fs = require('fs');

function loadMapperFile() {
    return new Promise((resolve, reject) => {
        try{
            let params = { Bucket: config.MAPPER_BUCKET_NAME, Key: config.MAPPER_OBJECT_KEY };
            let filePath = './metadata.js';
            s3.getObject(params, (error, data) => {
                if (error){
                    reject(error);
                }else{
                    fs.writeFileSync(filePath, data.Body.toString());
                    resolve();
                }
            });
        }catch(error){
            reject(error);
        }
    });
}

(async () => {
    try {
        console.log('Loading mapper file...')
        await loadMapperFile();
        console.log('Mapper file loaded')
        const MigrationJob = require('./index');
        const metadata = require('./metadata');

        const migrationJob = new MigrationJob(config.DYNAMODB_TABLE_NAME, config.MONGODB_COLLECTION_NAME, config.MONGODB_DATABASE_NAME, 100);
        migrationJob.setSourcefilterExpression(metadata.filterExpression,metadata.expressionAttributeNames,metadata.expressionAttributeValues);
        migrationJob.setMapper(metadata.mapperFunction);

        console.log('Running migration...')
        await migrationJob.run();
        process.exit(0);
    } catch (error) {
        console.error('Migration error',error);
        process.exit(1);
    }
})();




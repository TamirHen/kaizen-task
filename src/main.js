require('dotenv').config()
const csv = require('csvtojson');
const {downloadFile} = require('./downloadService');
const {fetchKeywords} = require('./keywordParser');
const {database, insertKeywordsToDatabase} = require('./database');
const {
    localPath,
    remotePath,
    sftp
} = require('../config')

async function main() {
    try {
        console.log(`\nConnecting to database...`)
        await database.connect()
        console.log('Success')
    } catch (error) {
        console.error('ERROR! Failed to connect')
        throw error
    }

    let data
    try {
        await downloadFile({
            localPath,
            remotePath,
            sftp
        })
        // convert csv file to json
        data = await csv().fromFile(localPath)
    } catch (error) {
        throw error
    }

    // for each url fetch keywords from the api and insert them to the database
    for (let {URL: url, Category: category} of data) {
        try {
            const keywords = await fetchKeywords(url)
            if (keywords) {
                await insertKeywordsToDatabase(url, category, keywords)
            }
        } catch (error) {
            console.error(error)
        }
    }

}

(async () => {
    try {
        console.log('Running program...')
        await main();
        console.log('\nProgram completed successfully')
    } catch (error) {
        console.error('\n', error)
    } finally {
        await database.end()
        // log empty line
        console.log()
        process.exit()
    }
})();



require('dotenv').config()
const csv = require('csvtojson');
const {downloadFile} = require('./downloadFile');
const {fetchKeywords} = require('./fetchKeywords');
const {database, insertKeywordsToDatabase} = require('./database');

const {
    localPath,
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
        await downloadFile()
        // convert csv file to json
        data = await csv().fromFile(localPath)
    } catch (error) {
        throw error
    }

    // for each url fetch keywords from api
    for (let {URL: url, Category: category} of data) {
        const keywords = await fetchKeywords(url)
        if (keywords) {
            await insertKeywordsToDatabase(url, category, keywords)
        }
    }

}

(async () => {
    try {
        await main();
    } catch (error) {
        console.error('\n', error)
    } finally {
        await database.end()
        // log empty line
        console.log()
        process.exit()
    }
})();



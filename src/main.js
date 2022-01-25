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
        console.error('ERROR! Failed to connect', error)
    }

    await downloadFile()

    // convert csv file to json
    const data = await csv().fromFile(localPath)
    if (!data) {
        console.error('ERROR! Could not open CSV file')
        return
    }

    // for each url fetch keywords from api
    for (let {URL: url, Category: category} of data) {
        const keywords = await fetchKeywords(url, category)
        await insertKeywordsToDatabase(url, category, keywords)
    }

}
main().then()



const format = require('pg-format');
const {Client} = require('pg');
const {database: {url, rejectUnauthorized}} = require('../config');

const database = new Client({
    connectionString: url,
    ssl: {
        rejectUnauthorized
    }
});

async function insertKeywordsToDatabase(url, category, keywords) {
    let values = []
    for (const {keyword, position} of keywords) {
        values.push([url, category, keyword, position])
    }

    // inserting all values in one database call
    try {
        const query = format('INSERT INTO keywords (source_url, category, keyword, keyword_position) VALUES %L', values)
        await database.query(query)
        console.log(`${keywords.length} keywords were inserted into the database for the url "${url}"`);
    } catch (error) {
        throw Error(`Could not insert url: ${url} to the database\n${error.stack}`)
    }
}

module.exports = {
    insertKeywordsToDatabase,
    database
}
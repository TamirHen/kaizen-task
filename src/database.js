const format = require('pg-format');
const {Client} = require('pg');
const {dbURL} = require('../config');

const database = new Client({
    connectionString: dbURL,
    ssl: {
        rejectUnauthorized: false
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
        console.error(`ERROR! Could not insert url: ${url} to the database`, error.stack)
        return
    }
}

module.exports = {
    insertKeywordsToDatabase,
    database
}
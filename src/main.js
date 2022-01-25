require('dotenv').config()
const express = require('express');
const axios = require('axios');
const {Client} = require('pg');
const csv = require('csvtojson')
const {fetchFile} = require('./fetchFile');
const port = process.env.PORT || 4000;
const remotePath = '/Interview Task - Categorisation.csv';
const localPath = 'data/Categorisation.csv';
const format = require('pg-format');

// config file
const timeout = 5000
const requestMobileKeywords = false
const requestTopPositionKeywords = ''
const requestColumns = 'Ph,Po'
const requestKeywordsLimit = 10
const config = {
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
}

const app = express()

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.listen(port, async () => {
    console.log(`App running on port ${port}.`)

    try {
        console.log(`\nConnecting to database...`)
        await db.connect()
        console.log('Success')
    } catch (error) {
        console.error('ERROR! Failed to connect', error)
    }

    await downloadCategorisationFile()
    await fetchKeywords()

})

async function downloadCategorisationFile() {
    // fetch csv file from sftp server
    await fetchFile(config, remotePath, localPath)
}

async function fetchKeywords() {
    // convert csv file to json
    const data = await csv().fromFile(localPath)
    for (let {URL: url, Category: category} of data) {
        console.log(`\n-- ${url} --`)
        // check that the url includes http or https:
        if (!url.includes('http')) {
            // if not, concat https to the url string- important for creating the URL object
            url = `https://${url}`
        }
        let urlObj
        try {
            urlObj = new URL(url)
        } catch (error) {
            console.error(`ERROR! ${url} is not a valid URL and will not be checked for keywords`)
            continue
        }
        // check if the url is only a domain or a url with specific path
        const isOnlyDomain = urlObj.pathname === '/'
        const requestParams = new URLSearchParams({
            type: isOnlyDomain ? 'domain_organic' : 'url_organic',
            key: process.env.SEMrush_API_KEY,
            display_limit: requestKeywordsLimit || 10,
            export_columns: requestColumns || 'Ph,Po',
            [isOnlyDomain ? 'domain' : 'url']: url,
            database: requestMobileKeywords ? 'mobile-uk' : 'uk',
            display_sort: requestTopPositionKeywords && 'po_asc'
        })

        let data
        try {
            console.log('Fetch keywords from API...')
            // const response = await axios
            //     .get(
            //         `${process.env.SEMrush_API_URL}?${requestParams.toString()}`,
            //         {timeout: timeout || 5000}
            //     )
            // data = response?.data
            data = `Keyword;Position
                buy mindstorms;1
                lego mindstorms ev4;1
                ev4 mindstorms;1
                lego mindstorm robot;2
                invention robot;6
                lego mindsotrm;6
                lego mindstorms;12
                lego robot hand;21
                lego robot;22
                lego technic robot;23`
            if (!data) {
                throw Error(`ERROR! Could not fetch data from API for the url: ${url}`)
            }
        } catch (error) {
            console.error(error)
            continue
        }

        // convert csv string to json
        const keywords = await csv({
            // delimiter return from the API is ';'
            delimiter: [',', ';']
        }).fromString(data)

        await insertKeywordsToDatabase(url, category, keywords)
    }


    async function insertKeywordsToDatabase(url, category, keywords) {
        let values = []
        for (let {Keyword: keyword, Position: position} of keywords) {
            values.push([url, category, keyword, position])
        }

        // inserting all values with one database call
        try {
            const query = format('INSERT INTO keywords (source_url, category, keyword, keyword_position) VALUES %L', values)
            await db.query(query, (err) => {
                if (err) {
                } else {
                }
            })
            console.log(`${keywords.length} keywords were inserted into the database for the url "${url}"`);
        } catch (error) {
            console.error(`ERROR! Could not insert url: ${url} to the database`, error.stack)
        }
    }

}
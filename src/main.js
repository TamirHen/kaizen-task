require('dotenv').config()
const express = require('express');
const axios = require('axios');
const {Client} = require('pg');
const csv=require('csvtojson')
const {fetchData} = require('./fetchData');
const port = process.env.PORT || 4000;

const app = express()

app.get('/', (req, res) => {
    res.send("Hello World")
})

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.listen(port, async () => {
    console.log(`App running on port ${port}.`)

    const config = {
        host: process.env.SFTP_HOST,
        username: process.env.SFTP_USERNAME,
        password: process.env.SFTP_PASSWORD
    }
    const remotePath = '/Interview Task - Categorisation.csv';
    const localPath = 'data/Categorisation.csv';
    // fetch csv file from sftp server
    await fetchData(config, remotePath, localPath)

    console.log(`Connecting to database...`)
    try {
        await db.connect()
        console.log('Success')
    } catch (error) {
        console.error('Failed to connect', error)
    }

    // convert csv file to json
    const data = await csv().fromFile(localPath)
    for (const {URL: url, Category: category} of data) {
        const requestParams = new URLSearchParams({
            type: 'url_organic',
            key: process.env.SEMrush_API_KEY,
            display_limit: 10,
            export_columns: 'Ph,Po',
            url,
            database: 'uk'
        })
        const response = await axios.get(`${process.env.SEMrush_API_URL}?${requestParams.toString()}`)
        console.log(response)
    }

})

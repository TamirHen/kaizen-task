require('dotenv').config()
const express = require('express');
const {Client} = require('pg');
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
    console.log(`Connecting to database...`)
    try {
        await db.connect()
        console.log('Success')
    } catch (error) {
        console.error('Failed to connect', error)
    }
    const config = {
        host: process.env.SFTP_HOST,
        username: process.env.SFTP_USERNAME,
        password: process.env.SFTP_PASSWORD
    }
    const remotePath = '/Interview Task - Categorisation.csv';
    const localPath = 'data/Categorisation.csv';

    await fetchData(config, remotePath, localPath)

})

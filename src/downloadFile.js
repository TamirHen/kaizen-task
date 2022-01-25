let Client = require('ssh2-sftp-client');
let sftp = new Client();

const {
    localPath,
    remotePath,
    sftp: {
        host,
        username,
        password
    }
} = require('../config')

const logDownloadChunks = (total_transferred, chunk, total) => {
    console.log(`${total_transferred}/${total}`)
}

const downloadFile = async () => {

    try {
        console.log('\nDownloading packages...')
        await sftp.connect({
            host,
            username,
            password
        })
        await sftp.fastGet(remotePath || '/', localPath || 'Categorisation.csv', {
            concurrency: 64, // Number of concurrent reads to use
            chunkSize: 32768, // Size of each read in bytes
            step: logDownloadChunks // callback called each time a chunk is transferred
        })
        console.log('Download complete')
        await sftp.end()
    } catch (error) {
        throw error
    }
}

module.exports = {
    downloadFile
}
let Client = require('ssh2-sftp-client');
let sftp = new Client();

const logDownloadChunks = (total_transferred, chunk, total) => {
    console.log(`${total_transferred}/${total}`)
}

const fetchData = async (config, remotePath, localPath) => {

    try {
        await sftp.connect(config)
        console.log('Downloading packages...')
        await sftp.fastGet(remotePath, localPath, {
            concurrency: 64, // Number of concurrent reads to use
            chunkSize: 32768, // Size of each read in bytes
            step: logDownloadChunks // callback called each time a chunk is transferred
        })
        console.log('Download complete')
        await sftp.end()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    fetchData
}
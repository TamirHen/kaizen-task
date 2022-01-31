const Client = require('ssh2-sftp-client');
const sftp = new Client();

const logDownloadChunks = (total_transferred, chunk, total) => {
    console.log(`${total_transferred}/${total} chunks transferred`)
}

const downloadFile = async ({
                                localPath,
                                remotePath,
                                sftp: {
                                    host,
                                    username,
                                    password,
                                    concurrency,
                                    chunkSize
                                }
                            }) => {

    try {
        console.log('\nConnecting to server...')
        await sftp.connect({
            host,
            username,
            password
        })
        console.log('Downloading packages...')
        await sftp.fastGet(remotePath, localPath, {
            // number of concurrent reads to use
            concurrency,
            // size of each read in bytes
            chunkSize,
            // callback called each time a chunk is transferred
            step: logDownloadChunks
        })
        console.log('Download complete')
    } catch (error) {
        throw error
    } finally {
        await sftp.end()
    }
}

module.exports = {
    downloadFile
}
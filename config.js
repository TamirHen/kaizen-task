module.exports = {
    /*
      type: string
      default: 'Interview Task - Categorisation.csv'
      info: path to download file from in sftp server
    */
    remotePath: 'Interview Task - Categorisation.csv',
    /*
      type: string
      default: 'Categorisation.csv'
      info: local path to save the downloaded file to
    */
    localPath: 'Categorization.csv',

    sftp: {
        /*
          type: string
          info: sftp server address
        */
        host: process.env.SFTP_HOST,
        /*
          type: string
          info: sftp server username
        */
        username: process.env.SFTP_USERNAME,
        /*
          type: string
          info: sftp server password
        */
        password: process.env.SFTP_PASSWORD,
        /*
          type: number
          default: 64
          info: number of concurrent reads to use
        */
        concurrency: 64,
        /*
          type: number
          default: 32768
          info: size of each read in bytes
        */
        chunkSize: 32768
    },

    database: {
        /*
          type: string
          info: full database url
        */
        url: process.env.DATABASE_URL,
        /*
          type: boolean
          default: false
          info: if not false the server will reject any connection which is not authorized with the list of supplied CAs (certificates).
        */
        rejectUnauthorized: false,
    },

    api: {
        /*
          type: string
          info: api key
        */
        key: process.env.API_KEY,
        /*
          type: string
          info: api url
        */
        url: process.env.API_URL,
        /*
          type: number
          default: 5000
          info: milliseconds- api call will timeout if there's no response
        */
        timeout: 5000,
        /*
          type: string
          default: 'uk'
          info: country of the keywords to request
          options: https://www.semrush.com/api-analytics/#databases
        */
        requestKeywordsOfCountry: 'uk',
        /*
          type: boolean
          default: false
          info: whether or not to request keywords for mobile search
          options: true, false
        */
        requestMobileKeywords: false,
        /*
          type: number
          default: 10
          info: limit the keywords to request from the api
        */
        requestKeywordsLimit: 10,
        /*
          type: number
          default: 0
          info: offset for the api results
        */
        requestKeywordsOffset: 0,
        /*
          type: string
          default: 'Ph,Po'
          info: desired columns to request, seperated input by comma
          options: https://www.semrush.com/api-analytics/#columns
        */
        requestColumns: 'Ph,Po',
        /*
          type: string, null
          default: 'po_asc'
          info: sort keywords by column
          options: null, https://www.semrush.com/api-analytics/#sortings
        */
        requestKeywordsSorted: 'po_asc'
    }
}
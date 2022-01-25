module.exports = {
  /*
    type: string
    default: '/'
    info: path to download file from in sftp server
  */
  remotePath: '/Interview Task - Categorisation.csv',
  /*
    type: string
    default: 'data/Categorisation.csv'
    info: local path to save the downloaded file to
  */
  localPath: 'data/Categorisation.csv',

  sftp: {
    /*
      type: string
      default: n/a
      info: sftp server address
    */
    host: process.env.SFTP_HOST,
    /*
      type: string
      default: n/a
      info: sftp server username
    */
    username: process.env.SFTP_USERNAME,
    /*
      type: string
      default: n/a
      info: sftp server password
    */
    password: process.env.SFTP_PASSWORD
  },
  /*
    type: string
    default: n/a
    info: full database url
  */
  dbURL: process.env.DATABASE_URL,

  api: {
    /*
      type: string
      default: n/a
      info: api key
    */
    key: process.env.SEMrush_API_KEY,
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
      info: limit of keywords to request for each url
    */
    requestKeywordsLimit: 10,
    /*
      type: string
      default: 'Ph,Po'
      info: desired columns to request seperated by comma
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
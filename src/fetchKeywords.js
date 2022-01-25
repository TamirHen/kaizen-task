const axios = require('axios');
const csv = require('csvtojson');
const {isValidUrl} = require('./helpers');

const {
    api: {
        key,
        url: apiURL,
        timeout,
        requestMobileKeywords,
        requestKeywordsOfCountry,
        requestKeywordsSorted,
        requestColumns,
        requestKeywordsLimit,
        requestKeywordsOffset
    }
} = require('../config')


async function fetchKeywords(url) {
    console.log(`\n-- ${url} --`)
    // check that the url includes http or https:
    if (!url.includes('http')) {
        // if not, concat 'https://' before the url- important for creating the URL object
        url = `https://${url}`
    }
    if (!isValidUrl(url)) {
        console.error(`ERROR! ${url} is not a valid URL and will not be checked for keywords`)
        return
    }
    let urlObj
    try {
        urlObj = new URL(url)
    } catch (error) {
        console.error(error)
        return
    }
    // check if the url is only a domain or a url with specific path
    const isOnlyDomain = urlObj.pathname === '/'
    let database = (requestMobileKeywords ? 'mobile-' : '') + requestKeywordsOfCountry || 'uk'
    // make sure that columns 'Ph' and 'Po' (keyword and position) are in the request
    let exportColumns = requestColumns || ''
    if (!exportColumns.includes('Ph')) {
        exportColumns = 'Ph,' + exportColumns
    }
    if (!exportColumns.includes('Po')) {
        exportColumns = 'Po' + exportColumns
    }
    const offset = requestKeywordsOffset || 0
    const requestParams = new URLSearchParams({
        type: isOnlyDomain ? 'domain_organic' : 'url_organic',
        key,
        display_limit: offset + (requestKeywordsLimit || 10),
        display_offset: offset,
        export_columns: exportColumns,
        [isOnlyDomain ? 'domain' : 'url']: url,
        database,
        display_sort: requestKeywordsSorted || null
    })

    let data
    try {
        console.log('Fetching keywords from API...')
        const response = await axios
            .get(
                `${apiURL}?${requestParams.toString()}`,
                {timeout: timeout || 5000}
            )
        data = response?.data
        // data = `Keyword;Position
        //         buy mindstorms;1
        //         lego mindstorms ev4;1
        //         ev4 mindstorms;1
        //         lego mindstorm robot;2
        //         invention robot;6
        //         lego mindsotrm;6
        //         lego mindstorms;12
        //         lego robot hand;21
        //         lego robot;22
        //         lego technic robot;23`
        if (!data || data.includes('ERROR')) {
            console.error(`ERROR! Could not find keywords for the url: ${url}`)
            return
        }
    } catch (error) {
        console.error('ERROR!', error.message)
        return
    }

    // convert csv string to json
    const keywords = await csv({
        // data return from API with ';' as delimiter
        delimiter: [',', ';']
    }).fromString(data)

    if (!keywords) {
        console.error('ERROR! API response is empty or in invalid format')
        return
    }

    // map and return array of keywords
    return keywords.map(kw => ({
        keyword: kw.Keyword,
        position: kw.Position
    }))
}

module.exports = {
    fetchKeywords
}
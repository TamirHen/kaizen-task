const axios = require('axios');
const csv = require('csvtojson');
const format = require('pg-format');

const {
    localPath,
    api: {
        key,
        timeout,
        requestMobileKeywords,
        requestKeywordsOfCountry,
        requestKeywordsSorted,
        requestColumns,
        requestKeywordsLimit
    }
} = require('../config')


async function fetchKeywords(url, category) {
    // check that the url includes http or https:
    console.log(`\n-- ${url} --`)
    if (!url.includes('http')) {
        // if not, concat https to the url string- important for creating the URL object
        url = `https://${url}`
    }
    let urlObj
    try {
        urlObj = new URL(url)
    } catch (error) {
        console.error(`ERROR! ${url} is not a valid URL and will not be checked for keywords`)
        return
    }
    // check if the url is only a domain or a url with specific path
    const isOnlyDomain = urlObj.pathname === '/'
    const database = requestMobileKeywords ? 'mobile-' : '' + requestKeywordsOfCountry || 'uk'
    const requestParams = new URLSearchParams({
        type: isOnlyDomain ? 'domain_organic' : 'url_organic',
        key,
        display_limit: requestKeywordsLimit || 10,
        export_columns: requestColumns || 'Ph,Po',
        [isOnlyDomain ? 'domain' : 'url']: url,
        database,
        display_sort: requestKeywordsSorted || null
    })

    let data
    try {
        console.log('Fetching keywords from API...')
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
            console.error(`ERROR! Could not fetch data from API for the url: ${url}`)
            return
        }
    } catch (error) {
        console.error(error)
        return
    }

    // convert csv string to json
    const keywords = await csv({
        // data return from API with ';' as delimiter
        delimiter: [',', ';']
    }).fromString(data)

    // extract and return the keywords
    return keywords.map(kw => ({
        keyword: kw.Keyword,
        position: kw.Position
    }))
}

module.exports = {
    fetchKeywords
}
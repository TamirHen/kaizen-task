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


async function fetchKeywords(stringUrl) {
    console.log(`\n-- ${stringUrl} --`)
    let url, isOnlyDomain
    try {
        ({url, isOnlyDomain} = prepareUrl(stringUrl))
    } catch (error) {
        throw error
    }
    const requestParams = prepareParams(isOnlyDomain, url)
    let data
    try {
        console.log('Fetching keywords from API...')
        const response = await axios
            .get(
                `${apiURL}?${requestParams.toString()}`,
                {timeout}
            )
        data = response?.data
        if (!data || data.includes('ERROR')) {
            console.log(`No keywords found for the url: ${url}`)
            return
        }
    } catch (error) {
        // throw only the error message and not all the response error object
        throw Error(error.message)
    }

    // convert csv string to json
    const keywords = await csv({
        // data return from API with ';' as delimiter
        delimiter: [',', ';']
    }).fromString(data)

    if (!keywords) {
        throw Error('API response is empty or in invalid format')
    }

    // map and return array of keywords
    return keywords.map(kw => ({
        keyword: kw.Keyword,
        position: kw.Position
    }))
}

function prepareUrl(url) {
    // check that the url includes http or https:
    if (!url.includes('http')) {
        // if not, concat 'https://' before the url- important for creating the URL object
        url = `https://${url}`
    }
    if (!isValidUrl(url)) {
        throw Error(`${url} is not a valid URL and will not be checked for keywords`)
    }
    let urlObj
    try {
        urlObj = new URL(url)
    } catch (error) {
        throw error
    }
    return {
        url,
        // check if the url is only a domain or a url with specific path
        isOnlyDomain: urlObj.pathname === '/'
    }
}

function prepareParams(isOnlyDomain, url) {
    let database = (requestMobileKeywords ? 'mobile-' : '') + requestKeywordsOfCountry
    // make sure that columns 'Ph' and 'Po' (keyword and position) are in the request
    let exportColumns = requestColumns
    if (!exportColumns.includes('Ph')) {
        exportColumns = 'Ph,' + exportColumns
    }
    if (!exportColumns.includes('Po')) {
        exportColumns = 'Po' + exportColumns
    }
    const offset = requestKeywordsOffset
    return new URLSearchParams({
        type: isOnlyDomain ? 'domain_organic' : 'url_organic',
        key,
        display_limit: offset + requestKeywordsLimit,
        display_offset: offset,
        export_columns: exportColumns,
        [isOnlyDomain ? 'domain' : 'url']: url,
        database,
        display_sort: requestKeywordsSorted
    })
}

module.exports = {
    fetchKeywords
}
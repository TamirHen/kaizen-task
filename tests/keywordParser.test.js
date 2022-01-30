const axios = require('axios')
const {fetchKeywords} = require('../src/keywordParser');

jest.mock('axios')

let url

beforeEach(() => {
    url = 'https://lego.com';
    axios.get.mockImplementation(() => Promise.resolve({
        data: `Keyword;Position
                new harry potter sets;1
                lego friends bedroom;1`
    }))
})

afterEach(() => {
    jest.clearAllMocks()
})


test('axios.get called once', async () => {
    await fetchKeywords(url)
    expect(axios.get).toBeCalledTimes(1)
})

test('fetchKeywords return an array of objects with keyword and position', async () => {
    const keywords = await fetchKeywords(url)
    const expected = [
        {
            keyword: 'new harry potter sets',
            position: 1
        },
        {
            keyword: 'lego friends bedroom',
            position: 1
        }
    ]
    expect(keywords).toEqual(expected)
})
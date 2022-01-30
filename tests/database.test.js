const {Client} = require('pg');
const {insertKeywordsToDatabase} = require('../src/database');

jest.mock('pg', () => {
    const mockClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    }
    return {Client: jest.fn(() => mockClient)}
})
let database
beforeEach(() => {
    database = new Client()
})
afterEach(() => {
    jest.clearAllMocks()
})

// group tests that require keywords
describe('create keywords before each', () => {
    let url, category, keywords

    beforeEach(() => {
        url = 'https://lego.com'
        category = 'Homepage'
        keywords = [
            {
                keyword: 'lego',
                position: 1
            },
            {
                keyword: 'bricks',
                position: 5
            }
        ]
    })

    test('database.query() called once', async () => {
        await insertKeywordsToDatabase(url, category, keywords)
        expect(database.query).toBeCalledTimes(1)
    })

    test('send expected query to database', async () => {
        await insertKeywordsToDatabase(url, category, keywords)
        let expectedQueryParam = `INSERT INTO keywords (source_url, category, keyword, keyword_position) VALUES`
        for (const [index, {keyword, position}] of keywords.entries()) {
            expectedQueryParam += ` ('${url}', '${category}', '${keyword}', '${position}')${index < keywords.length - 1 ? ',' : ''}`
        }
        expect(database.query).toBeCalledWith(expectedQueryParam)
    })
})
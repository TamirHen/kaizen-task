const {isValidUrl} = require('../src/helpers');
test('isValidUrl return true for a valid url', () => {
    const urls = [
        'https://www.google.com',
        'http://not-very-secure-url.co.uk',
        'https://www.lego.com/en-us/themes/harry-potter'
    ]

    for (const url of urls) {
        expect(isValidUrl(url)).toBe(true)
    }
})

test('isValidUrl return false for invalid url', () => {
    const urls = [
        'www.google.com',
        'https://not valid.co.uk',
        'lego.com'
    ]

    for (const url of urls) {
        expect(isValidUrl(url)).toBe(false)
    }
})
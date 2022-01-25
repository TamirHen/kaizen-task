function isValidUrl(_string) {
    const matchPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchPattern.test(_string);
}

module.exports = {
    isValidUrl
}

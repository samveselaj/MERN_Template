function replaceSpecialChars(b64string) {
    return b64string.replace(/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
            case '=':
                return '';
            case '+':
                return '-';
            case '/':
                return '_';
        }
    });
};

module.exports = { replaceSpecialChars };
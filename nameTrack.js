function NameTrack(nameList) {
    var namesGreeted = nameList || {};
    var errName = '';

    function loadItems() {
        namesGreeted = {};
    }
    function addName(userName, lang) {
        var upFirst = userName.toUpperCase();
        const regex = /\d/;
        var numTest = regex.test(userName);
        errName = userName;
        if (numTest === false) {
            if (namesGreeted[upFirst] === undefined) {
                namesGreeted[upFirst] = 0;
            }
        }
        if (lang === "english") {
            return "Hello, " + userName;
        } else if (lang === "afrikaans") {
            return "Hallo, " + userName;
        } else if (lang === "isixhosa") {
            return "Molo, " + userName;
        } else {
            return "Hello, " + userName;
        }

    }
    function displayCounter() {
        var numberOfNames = Object.keys(namesGreeted);
        return numberOfNames.length;
    }
    function displayString() {
        return namesGreeted;
    }
    function errorCheck() {
        if (errName === '') {
            return 'error';
        }
    }

    return {
        greet: addName,
        counter: displayCounter,
        load: loadItems,
        items: displayString,
        error: errorCheck
    }
}
module.exports = function (nameList) {
    var namesGreeted = nameList || {};
    var errName = '';
    var newName = '';

    function loadItems() {
        namesGreeted = {};
    }
    function addName(userName) {
        newName = userName;
        var upFirst = userName.toUpperCase();
        const regex = /\d/;
        var numTest = regex.test(userName);
        errName = userName;
        if (numTest === false) {
            if (namesGreeted[upFirst] === undefined) {
                namesGreeted[upFirst] = 0;
            }
        }
        // if (lang === "english") {
        //     return "Hello, " + userName;
        // } else if (lang === "afrikaans") {
        //     return "Hallo, " + userName;
        // } else if (lang === "isixhosa") {
        //     return "Molo, " + userName;
        // } else {
        //     return "Hello, " + userName;
        // }

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
    function displayName(){
        return newName;
    }

    return {
        greet: addName,
        counter: displayCounter,
        load: loadItems,
        items: displayString,
        error: errorCheck,
        name: displayName
    }
}
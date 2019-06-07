module.exports = function (nameList) {
    var namesGreeted = nameList || {};
    var nameData = []
    var newName = '';
    var langGreet = '';

    function loadItems() {
        namesGreeted = {};
    }

    function addName(userName) {
        newName = userName.charAt(0).toUpperCase() + (userName.slice(1)).toLowerCase();
        const regex = /\d/;
        var numTest = regex.test(newName);
        if (userName.trim()) {
            if (numTest === false) {
                if (namesGreeted[newName] === undefined) {
                    namesGreeted[newName] = 0;
                    nameData.push({ name: newName, times: 1 });
                } else {
                    for (var x = 0; x < nameData.length; x++) {
                        if (newName === nameData[x].name) {
                            nameData[x].times++;
                        }
                    }
                }
            }
        }
    }
    function determineGreeting() {
        return langGreet;
    }
    function displayCounter() {
        return nameData.length;
    }
    function displayName() {
        return newName;
    }
    function displayNames() {
        return nameData;
    }
    function displayGreetedFor(name) {
        var num = 0;
        for (var x = 0; x < nameData.length; x++) {
            if (name === nameData[x].name) {
                num = nameData[x].times;
            }
        }
        return num;
    }
    function loadLanguage(lang){
        if (lang === "english") {
            langGreet = "Hello, ";
        } else if (lang === "afrikaans") {
            langGreet = "Hallo, ";
        } else if (lang === "isixhosa") {
            langGreet = "Molo, ";
        } 
    }


    return {
        greet: addName,
        counter: displayCounter,
        load: loadItems,
        name: displayName,
        nameList: displayNames,
        amntFor: displayGreetedFor,
        greeting : determineGreeting,
        lang : loadLanguage
    }
}
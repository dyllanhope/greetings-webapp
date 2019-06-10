module.exports = function (nameList) {
    var nameData = nameList || [];
    var newName = '';
    var langGreet = '';

    function addName(userName) {
        let test = false;
        newName = userName.charAt(0).toUpperCase() + (userName.slice(1)).toLowerCase();
        const regex = /\d/;
        let numTest = regex.test(newName);
        if (userName.trim()) {
            if (numTest === false) {
                for (let i = 0; i < nameData.length; i++) {
                    if (newName === nameData[i].name) {
                        nameData[i].times++;
                        test = true;
                    }
                }
                if (test === false) {
                    nameData.push({ name: newName, times: 1 });
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
        let num = 0;
        for (let x = 0; x < nameData.length; x++) {
            if (name === nameData[x].name) {
                num = nameData[x].times;
            }
        }
        return num;
    }
    function loadLanguage(lang) {
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
        name: displayName,
        nameList: displayNames,
        amntFor: displayGreetedFor,
        greeting: determineGreeting,
        lang: loadLanguage
    }
}
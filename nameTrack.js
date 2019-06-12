module.exports = function (pool) {
    var newName = '';
    var langGreet = '';

    async function addName(userName) {
        newName = userName.trim()
        newName = newName.charAt(0).toUpperCase() + (newName.slice(1)).toLowerCase();
        const regex = /\d/;
        let numTest = regex.test(newName);
        if (userName.trim()) {
            if (numTest === false) {
                let test = await pool.query("SELECT * FROM names_greeted WHERE name = $1", [newName]);
                if (test.rowCount === 1) {
                    let newNum = test.rows[0].times_greeted;
                    await pool.query('UPDATE names_greeted SET name = $1,times_greeted = $2 +1 WHERE id = $3', [newName, newNum, test.rows[0].id]);
                }
                else {
                    let data = [
                        newName,
                        1
                    ]
                    await pool.query("insert into names_greeted (name, times_greeted) values ($1, $2) returning name, times_greeted", data);
                }
            }
        }
    }
    async function displayInfo() {
        let nameList = await pool.query("SELECT * FROM names_greeted");
        return nameList.rows;
    }
    async function clearTable() {
        newName = '';
        langGreet = '';
        await pool.query("DELETE FROM names_greeted");
    }
    function determineGreeting() {
        return langGreet;
    }
    async function displayCounter() {
        let result = await pool.query("SELECT COUNT(*) FROM names_greeted");
        if (result) {
            var count = result.rows[0].count;
        } else {
            var count = 0;
        }
        return count;
    }
    function displayName() {
        return newName;
    }
    async function displayGreetedFor(name) {
        let times = await pool.query("SELECT * FROM names_greeted WHERE name = $1", [name]);
        let count = times.rows[0].times_greeted;
        return count;
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
        show: displayInfo,
        clear: clearTable,
        counter: displayCounter,
        name: displayName,
        // nameList: displayNames,
        amntFor: displayGreetedFor,
        greeting: determineGreeting,
        lang: loadLanguage
    }
}
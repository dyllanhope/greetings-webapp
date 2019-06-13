'use strict';
module.exports = function (pool) {
    var newName = '';
    var langGreet = '';

    async function addName (userName, lang) {
        newName = userName.trim();
        newName = newName.charAt(0).toUpperCase() + (newName.slice(1)).toLowerCase();
        const regex = /\d/;
        let numTest = regex.test(newName);
        if (userName.trim()) {
            if (numTest === false) {
                let test = await pool.query('SELECT * FROM names_greeted WHERE name = $1', [newName]);
                if (test.rowCount === 1) {
                    let newNum = test.rows[0].times_greeted;
                    await pool.query('UPDATE names_greeted SET name = $1,times_greeted = $2 +1 WHERE id = $3', [newName, newNum, test.rows[0].id]);
                } else {
                    let data = [
                        newName,
                        1
                    ];
                    await pool.query('insert into names_greeted (name, times_greeted) values ($1, $2) returning name, times_greeted', data);
                }
            }
        }
        if (lang === 'english') {
            langGreet = 'Hello, ';
        } else if (lang === 'afrikaans') {
            langGreet = 'Hallo, ';
        } else if (lang === 'isixhosa') {
            langGreet = 'Molo, ';
        }
        newName = langGreet + newName;
    };
    async function displayInfo () {
        let nameList = await pool.query('SELECT * FROM names_greeted');
        return nameList.rows;
    };
    async function clearTable () {
        newName = '';
        langGreet = '';
        await pool.query('DELETE FROM names_greeted');
    };
    async function displayCounter () {
        let result = await pool.query('SELECT COUNT(*) FROM names_greeted');
        var count = 0;
        if (result) {
            count = result.rows[0].count;
        }
        return count;
    };
    function displayGreeting () {
        return newName;
    };
    async function displayGreetedFor (name) {
        let times = await pool.query('SELECT * FROM names_greeted WHERE name = $1', [name]);
        let count = times.rows[0].times_greeted;
        return count;
    };
    return {
        addName,
        displayInfo,
        clearTable,
        displayCounter,
        displayGreeting,
        displayGreetedFor
    };
};

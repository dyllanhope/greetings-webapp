/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const NameTrack = require('../name-track');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/names_greeted_tests';

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
describe('Testing Greetings WebApp', function () {
    describe('Testing counter', function () {
        it('Should return 5, with 6 names entered and 1 name repeating', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Michael');
            await greetCheckOne.addName('John');
            await greetCheckOne.addName('Sam');
            await greetCheckOne.addName('Daniel');
            await greetCheckOne.addName('Dyllan');

            let num = await greetCheckOne.displayCounter();
            assert.strict.equal(num, '5');
        });
        it('Should return the 0 that was loaded in for the counter to be updated for a page refresh', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            let num = await greetCheckOne.displayCounter();
            assert.strict.equal(num, '0');
        });
        it('Should return a counter of 1 with capitals in different places', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('DYLLAN');
            await greetCheckOne.addName('dyllan');
            await greetCheckOne.addName('DyLlAn');

            let num = await greetCheckOne.displayCounter();
            assert.strict.equal(num, '1');
        });
        it('Should return a counter of 0 with no names entered', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);

            let num = await greetCheckOne.displayCounter();
            assert.strict.equal(num, '0');
        });
    });
    describe('Testing the times_greeted section of db', function () {
        it("Should return 'Dyllan' has been greeted twice", async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Dyllan');

            let num = await greetCheckOne.displayGreetedFor('Dyllan');
            assert.strict.deepEqual(num, 2);
        });
        it("Should return 'Sam' has been greeted once and 'Dyllan' twice", async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Sam');

            let num = await greetCheckOne.displayGreetedFor('Sam');
            assert.strict.deepEqual(num, 1);

            num = await greetCheckOne.displayGreetedFor('Dyllan');
            assert.strict.deepEqual(num, 2);
        });
    });
    describe('Testing name saving', function () {
        it('Should return 2 of the entered names, and exclude the repeated name', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Michael');
            await greetCheckOne.addName('Dyllan');
            let testNames = await pool.query('SELECT name FROM names_greeted');
            assert.strict.deepEqual(testNames.rows, [{ name: 'Michael' }, { name: 'Dyllan' }]);
        });
        it('Should return 4 of the entered names, and exclude the repeated names', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Michael');
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Sam');
            await greetCheckOne.addName('John');
            await greetCheckOne.addName('Dyllan');
            let testNames = await pool.query('SELECT name FROM names_greeted');
            assert.strict.deepEqual(testNames.rows, [{ name: 'Michael' }, { name: 'Sam' }, { name: 'John' }, { name: 'Dyllan' }]);
        });
    });
    describe('Testing table clearing', function () {
        it('Should return an empty table after adding 2 names then clearing', async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan');
            await greetCheckOne.addName('Michael');

            let testNames = await pool.query('SELECT name FROM names_greeted');
            assert.strict.deepEqual(testNames.rows, [{ name: 'Dyllan' }, { name: 'Michael' }]);

            await greetCheckOne.clearTable();
            testNames = await greetCheckOne.displayInfo();
            assert.strict.deepEqual(testNames, []);
        });
    });
    describe('Testing greeting message', function () {
        it("Should return 'Hello, Dyllan' with language English", async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan', 'english');

            let testNames = await greetCheckOne.displayGreeting();
            assert.strict.deepEqual(testNames, 'Hello, Dyllan');
        });
        it("Should return 'Hallo, Dyllan' with language Afrikaans", async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan', 'afrikaans');

            let testNames = await greetCheckOne.displayGreeting();
            assert.strict.deepEqual(testNames, 'Hallo, Dyllan');
        });
        it("Should return 'Molo, Dyllan' with language IsiXhosa", async function () {
            await pool.query('delete from names_greeted;');
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.addName('Dyllan', 'isixhosa');

            let testNames = await greetCheckOne.displayGreeting();
            assert.strict.deepEqual(testNames, 'Molo, Dyllan');
        });
    });
    after(function () {
        pool.end();
    });
});

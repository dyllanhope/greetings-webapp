const assert = require("assert");
const NameTrack = require("../nameTrack");
const pg = require("pg");
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
describe("Testing Greetings WebApp", function () {

    beforeEach(async function () {
        await pool.query("delete from names_greeted;");
    });
    describe("Testing counter", function () {
        it('Should return 5, with 6 names entered and 1 name repeating', async function () {
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Michael");
            await greetCheckOne.greet("John");
            await greetCheckOne.greet("Sam");
            await greetCheckOne.greet("Daniel");
            await greetCheckOne.greet("Dyllan");

            let num = await greetCheckOne.counter();
            assert.equal(num, 5);
        });
        it('Should return the 0 that was loaded in for the counter to be updated for a page refresh', async function () {
            let greetCheckOne = NameTrack(pool);
            let num = await greetCheckOne.counter();
            assert.equal(num, 0);
        })
        it('Should return a counter of 1 with capitals in different places', async function () {
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("DYLLAN");
            await greetCheckOne.greet("dyllan");
            await greetCheckOne.greet("DyLlAn");

            let num = await greetCheckOne.counter();
            assert.equal(num, 1);
        });
    });
    describe("Testing the times_greeted section of db", function () {
        it("Should return 'Dyllan' has been greeted twice", async function () {
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Dyllan");

            let greeted = await pool.query("SELECT times_greeted FROM names_greeted");
            assert.deepEqual(greeted.rows, [{ times_greeted: 2 }]);

        });
        it("Should return 'Sam' has been greeted once and 'Dyllan' twice", async function () {
            let greetCheckOne = NameTrack(pool);

            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Sam");

            let name = "Sam";

            let greeted = await pool.query("SELECT times_greeted FROM names_greeted WHERE name = $1", [name]);
            assert.deepEqual(greeted.rows, [{ times_greeted: 1 }]);

            name = "Dyllan";

            greeted = await pool.query("SELECT times_greeted FROM names_greeted WHERE name = $1", [name]);
            assert.deepEqual(greeted.rows, [{ times_greeted: 2 }]);

        });
    });
    describe("Testing name saving", function () {
        it('Should return 2 of the entered names, and exclude the repeated name', async function () {
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Michael");
            await greetCheckOne.greet("Dyllan");
            let testNames = await pool.query("SELECT name FROM names_greeted");
            assert.deepEqual(testNames.rows, [{ name: "Michael" }, { name: "Dyllan" }]);
        });
        it('Should return 4 of the entered names, and exclude the repeated names', async function () {
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Michael");
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Sam");
            await greetCheckOne.greet("John");
            await greetCheckOne.greet("Dyllan");
            let testNames = await pool.query("SELECT name FROM names_greeted");
            assert.deepEqual(testNames.rows, [{ name: "Michael" }, { name: "Sam" }, { name: "John" }, { name: "Dyllan" }]);
        });
    });
    describe("Testing table clearing", function () {
        it("Should return an empty table after adding 2 names then clearing", async function () {
            let greetCheckOne = NameTrack(pool);
            await greetCheckOne.greet("Dyllan");
            await greetCheckOne.greet("Michael");

            let testNames = await pool.query("SELECT name FROM names_greeted");
            assert.deepEqual(testNames.rows, [{ name: "Dyllan" }, { name: "Michael" }]);

            await greetCheckOne.clear();
            testNames = await pool.query("SELECT * FROM names_greeted");
            assert.deepEqual(testNames.rows, []);
        });
    });
    after(function () {
        pool.end();
    });
});
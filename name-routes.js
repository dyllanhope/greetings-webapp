module.exports = function (nameTracker) {

    async function index(req, res) {
        let count = await nameTracker.displayCounter();
        res.render("index", {
            name: nameTracker.displayGreeting(),
            counter: count
        });
    }

    async function greet(req, res) {
        const regex = /\d/;
        let numTest = regex.test(req.body.inputName);

        if (req.body.languageChoice) {
            if ((req.body.inputName).trim() && numTest === false) {
                await nameTracker.addName(req.body.inputName, req.body.languageChoice);
                res.redirect('/');
            } else {
                req.flash("info", "Enter a name!");
                res.redirect('/');
            }
        } else {
            req.flash("info", "Select a language!");
            res.redirect('/');
        }
    }
    async function clear(req, res) {
        await nameTracker.clearTable();
        res.redirect("/");
    }

    async function greeted(req, res) {
        let nameList = await nameTracker.displayInfo();
        res.render('names', {
            nameList
        });
    }

    async function counter(req, res) {

        let name = req.params.nameChoice;
        let num = await nameTracker.displayGreetedFor(name);

        if (num === 1) {
            req.flash("amount",name + " has been greeted " + num + " time");
        } else {
            req.flash("amount",name + " has been greeted " + num + " times");
        }
        res.redirect("/greeted");
    }

    function returnHome(req, res) {
        res.redirect('/');
    }

    return {
        index,
        greet,
        greeted,
        clear,
        counter,
        returnHome
    }
}
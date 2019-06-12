module.exports = function (nameTracker) {

    async function index(req, res) {
        let count = await nameTracker.counter();
        res.render("index", {
            name: nameTracker.name(),
            counter: count,
            greet: nameTracker.greeting()
        });
    }

    async function greet(req, res) {

        if (req.body.languageChoice) {
            if ((req.body.inputName).trim()) {
                nameTracker.lang(req.body.languageChoice);
                await nameTracker.greet(req.body.inputName);
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
    function clear(req, res) {
        nameTracker.clear();
        res.redirect("/");
    }

    async function greeted(req, res) {
        let nameList = await nameTracker.show();
        res.render('names', {
            nameList
            //nameList: nameTracker.nameList()
        });
    }

    async function counter(req, res) {

        let name = req.params.nameChoice;
        let num = await nameTracker.amntFor(name);

        if (num === 1) {
            req.flash("amount", "Hello, " + name + " has been greeted " + num + " time");
        } else {
            req.flash("amount", "Hello, " + name + " has been greeted " + num + " times");
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
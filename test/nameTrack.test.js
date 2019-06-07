describe('Testing the counting section of the NameTrack function', function(){
    it('Should return 5, with 6 names entered and 1 name repeating', function(){
        var greetCheckOne = NameTrack({Mike:0,Micah:0});
        greetCheckOne.greet("Dyllan");
        greetCheckOne.greet("Michael");
        greetCheckOne.greet("John");
        greetCheckOne.greet("Sam");
        greetCheckOne.greet("Daniel");
        greetCheckOne.greet("Dyllan");
        assert.equal(greetCheckOne.counter(),7);
    })
    it('Should return the 0 that was loaded in for the counter to be updated for a page refresh', function(){
        var greetCheckOne = NameTrack({});
        assert.equal(greetCheckOne.counter(),0);
    })
    it('Should return an empty object with no parameter inserted', function(){
        var greetCheckOne = NameTrack();
        assert.equal(greetCheckOne.counter(),0);
    })
    it('Should return a counter of 1 with capitals in different places', function(){
        var greetCheckOne = NameTrack();
        
        greetCheckOne.greet("Dyllan");
        greetCheckOne.greet("DYLLAN");
        greetCheckOne.greet("dyllan");
        greetCheckOne.greet("DyLlAn");

        assert.equal(greetCheckOne.counter(),1);
    })
});
describe('Testing the greet and text handling section of the NameTrack function', function(){
    it('Should return 2 of the entered names, and exclude the repeated name', function(){
        var greetCheckOne = NameTrack({});
        greetCheckOne.greet("Dyllan");
        greetCheckOne.greet("Michael");
        greetCheckOne.greet("Dyllan");
        assert.deepEqual(greetCheckOne.items(), { DYLLAN: 0, MICHAEL: 0 });
    })
    it('Should return the 2 names that were loaded in for the list of names previously entered for a page refresh', function(){
        var greetCheckOne = NameTrack({ DYLLAN: 0, MICHAEL: 0 });
        assert.deepEqual(greetCheckOne.items(),{ DYLLAN: 0, MICHAEL: 0 });
    })
    it('Should return "Hello, Dyllan" with the name and language input (English)', function(){
        var greetCheckOne = NameTrack();
        assert.equal(greetCheckOne.greet("Dyllan","english"),"Hello, Dyllan");
    })
    it('Should return "Molo, Dyllan" with the name and language input (isiXhosa)', function(){
        var greetCheckOne = NameTrack();
        assert.equal(greetCheckOne.greet("Dyllan","isixhosa"),"Molo, Dyllan");
    })
    it('Should return the default language setting with the name input but no language input', function(){
        var greetCheckOne = NameTrack();
        assert.equal(greetCheckOne.greet("Dyllan"),"Hello, Dyllan");
    })
    it('Should return "error" when there was no name input', function(){
        var greetCheckOne = NameTrack();
        greetCheckOne.greet('');
        assert.equal(greetCheckOne.error(),"error");
    })


})
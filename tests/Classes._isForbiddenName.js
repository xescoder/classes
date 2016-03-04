describe.skip('Classes._isForbiddenName', function() {

    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает true, если ключ уже есть в объекте', function() {
        var obj = { test: 1 };
        assert.isTrue(Classes.isForbiddenName(obj, 'test'));
    });

});

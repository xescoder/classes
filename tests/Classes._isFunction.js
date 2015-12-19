describe('Classes._isFunction', function() {

    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает true для функции', function() {
        var value = _.noop;
        assert.isTrue(Classes.isFunction(value));
    });

    it('возвращает false для примивного типа', function() {
        var value = 5;
        assert.isFalse(Classes.isFunction(value));
    });

    it('возвращает false для объекта', function() {
        var value = {};
        assert.isFalse(Classes.isFunction(value));
    });

});

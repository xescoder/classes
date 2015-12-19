describe('Classes.enableTestMode', function() {

    var Classes;

    before(function() {
        Classes = getClasses();
    });

    it('enableTestMode включает тестовый режим', function() {
        Classes.enableTestMode();
        assert.ok(Classes.isFunction, 'внутренние функции Classes не доступны');
    });

});

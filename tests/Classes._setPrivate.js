describe('Classes._setPrivate', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('устанавливает значение приватного поля', function() {
        Classes.setPrivate('testField', 123);
        assert.strictEqual(Classes.testField, 123);
    });
});

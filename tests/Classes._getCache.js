describe.skip('Classes._getCache', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает undefined если кэш не проинициализирован', function() {
        var value = Classes.getCache('param');
        assert.isUndefined(value);
    });

    it('возвращает undefined если ключа нет в кэше', function() {
        Classes.setPrivate('cache', {});

        var value = Classes.getCache('param');
        assert.isUndefined(value);
    });

    it('возвращает значение ключа если он есть в кэше', function() {
        Classes.setPrivate('cache', { param: 'test' });

        var value = Classes.getCache('param');
        assert.strictEqual(value, 'test');
    });
});

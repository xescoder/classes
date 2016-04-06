describe.skip('Classes._setCache', function() {
    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('сохраняет значение в кэш по ключу', function() {
        Classes.setCache('test', 123);
        assert.strictEqual(Classes.cache.test, 123);
    });

    it('возвращает сохраняемое значение', function() {
        var res = Classes.setCache('test', 5);
        assert.strictEqual(res, 5);
    });
});

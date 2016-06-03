describe('Classes.getFullName', function() {
    var Classes;

    beforeEach(function() {
        Classes = getClasses();
    });

    it('является функцией', function() {
        assert.isFunction(Classes.getFullName);
    });

    it('не принимает аргументов', function() {
        assert.strictEqual(Classes.getFullName.length, 0);
    });

    it('возвращает корневое имя для библиотеки в целом', function() {
        assert.equal(Classes.getFullName(), 'Classes');
    });

    it('возвращает составное имя для пространства имён', function() {
        Classes.name('System');
        Classes.System.name('UI');
        assert.equal(Classes.System.UI.getFullName(), 'Classes.System.UI');
    });

    it('возвращает составное имя для класса', function() {
        Classes.name('System');
        Classes.System.decl('Console');
        assert.equal(Classes.System.Console.getFullName(), 'Classes.System.Console');
    });
});

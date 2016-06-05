describe('Classes.decl', function() {
    var Classes;

    beforeEach(function() {
        Classes = getClasses();
    });

    it('является функцией', function() {
        assert.isFunction(Classes.decl);
    });

    it('принимает 2 аргумента', function() {
        assert.strictEqual(Classes.decl.length, 2);
    });

    it('декларирует класс', function() {
        Classes.decl('Test', {});
        assert.equal(Classes.Test.getType(), 'Class');
    });

    it('позволяет задекларировать класс внутри существующего пространства имён', function() {
        Classes.name('System.IO');
        Classes.System.IO.decl('StreamWriter', {});
        assert.equal(Classes.System.IO.StreamWriter.getType(), 'Class');
    });

    it('нельзя перезаписать существующий класс', function() {
        Classes.decl('Test', {});

        var test = function() {
            Classes.decl('Test', {});
        };

        assert.throw(test, 'Classes. Не удалось создать класс: имя Classes.Test уже занято.');
    });
});

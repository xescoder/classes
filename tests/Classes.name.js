describe('Classes.name', function() {
    var Classes;

    beforeEach(function() {
        Classes = getClasses();
    });

    it('является функцией', function() {
        assert.isFunction(Classes.name);
    });

    it('принимает 1 аргумент', function() {
        assert.strictEqual(Classes.name.length, 1);
    });

    it('рекурсивно создаёт пространство имён по переданному имени', function() {
        Classes.name('System.General.Math.Numbers');

        assert.strictEqual(Classes.System.getType(), 'Namespace');
        assert.strictEqual(Classes.System.General.getType(), 'Namespace');
        assert.strictEqual(Classes.System.General.Math.getType(), 'Namespace');
        assert.strictEqual(Classes.System.General.Math.Numbers.getType(), 'Namespace');
    });

    it('есть возможность создать пространство имён внутри существующего', function() {
        Classes.name('System.General');
        Classes.System.General.name('Math.Numbers');

        assert.strictEqual(Classes.System.General.Math.Numbers.getType(), 'Namespace');
    });

    it('должно генерировать ошибку при попытке затереть существующее пространство имён', function() {
        Classes.name('System.IO');

        var test = function() {
            Classes.name('System.IO');
        };

        assert.throw(test, 'Classes. Не удалось создать пространство имён: имя Classes.System уже занято.');
    });
});

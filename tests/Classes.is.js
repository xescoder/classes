describe('Classes.is', function() {
    var Classes, obj;

    before(function() {
        Classes = getClasses();

        Classes.decl('A', {});

        Classes.decl('B', {
            extend: Classes.A
        });

        Classes.decl('C', {
            extend: Classes.B
        });

        Classes.decl('D', {});

        obj = new Classes.C();
    });

    it('является функцией', function() {
        assert.isFunction(Classes.is);
    });

    it('принимает 2 аргумента', function() {
        assert.strictEqual(Classes.is.length, 2);
    });

    it('возвращает false для примитивных типов', function() {
        assert.isFalse(Classes.is(3, Number));
    });

    it('возвращает false, если конструктор не является функцией', function() {
        assert.isFalse(Classes.is({}, []));
    });

    it('возвращает true, если объект является истансом конструктора', function() {
        var arr = [];
        assert.isTrue(Classes.is(arr, Array));
    });

    it('возвращает true, если объект унаследован от класса', function() {
        assert.isTrue(Classes.is(obj, Classes.C));
        assert.isTrue(Classes.is(obj, Classes.B));
        assert.isTrue(Classes.is(obj, Classes.A));
    });

    it('возвращает false, если объект не унаследован от класса', function() {
        assert.isFalse(Classes.is(obj, Classes.D));
    });
});

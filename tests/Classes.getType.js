describe('Classes.getType', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.name('Namespace');

        Classes.decl('Test');
    });

    it('является функцией', function() {
        assert.isFunction(Classes.getType);
    });

    it('принимает 1 аргумент', function() {
        assert.strictEqual(Classes.getType.length, 1);
    });

    it('должен возвращать Undefined для undefined', function() {
        var type = Classes.getType(undefined);
        assert.strictEqual(type, 'Undefined');
    });

    it('должен возвращать Null для null', function() {
        var type = Classes.getType(null);
        assert.strictEqual(type, 'Null');
    });

    it('должен возвращать Boolean для false', function() {
        var type = Classes.getType(false);
        assert.strictEqual(type, 'Boolean');
    });

    it('должен возвращать Number для числа', function() {
        var type = Classes.getType(5);
        assert.strictEqual(type, 'Number');
    });

    it('должен возвращать String для строки', function() {
        var type = Classes.getType('123');
        assert.strictEqual(type, 'String');
    });

    it('должен возвращать Function для функции', function() {
        var value = function() {},
            type = Classes.getType(value);

        assert.strictEqual(type, 'Function');
    });

    it('должен возвращать Object для объекта', function() {
        var value = {},
            type = Classes.getType(value);

        assert.strictEqual(type, 'Object');
    });

    it('должен возвращать Array для массива', function() {
        var value = [],
            type = Classes.getType(value);

        assert.strictEqual(type, 'Array');
    });

    it('должен возвращать Date для даты', function() {
        var value = new Date,
            type = Classes.getType(value);

        assert.strictEqual(type, 'Date');
    });

    it('должен возвращать Class для класса', function() {
        var value = Classes.Test,
            type = Classes.getType(value);

        assert.strictEqual(type, 'Class');
    });

    it('должен возвращать Class при вызове напрямую у класса', function() {
        assert.strictEqual(Classes.Test.getType(), 'Class');
    });

    it('должен возвращать Namespace для пространства имён', function() {
        var value = Classes.Namespace,
            type = Classes.getType(value);

        assert.strictEqual(type, 'Namespace');
    });

    it('должен возвращать Namespace при вызове напрямую у простанства имён', function() {
        assert.strictEqual(Classes.Namespace.getType(), 'Namespace');
    });

    it('должен возвращать название типа для экземпляра класса', function() {
        var value = new Classes.Test(),
            type = Classes.getType(value);

        assert.strictEqual(type, 'Classes.Test');
    });
});

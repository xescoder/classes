describe.skip('Classes._createClass', function() {
    var Classes;

    beforeEach(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает ошибку, если имя класса уже занято', function() {
        Classes.Test = { field: 4 };

        var test = function() {
            Classes.createClass('Test', sinon.stub());
        };

        assert.throw(test, 'Classes. Не удалось создать класс: имя Test уже занято.');
        assert.strictEqual(Classes.Test.field, 4);
    });

    it('тип создаваемого класса Class', function() {
        Classes.createClass('Test', sinon.stub());
        assert.strictEqual(Classes.Test.__type__, 'Class');
    });

    it('тип прототипа создаваемого класса равен названию класса', function() {
        Classes.createClass('Test', sinon.stub());
        assert.strictEqual(Classes.Test.prototype.__type__, 'Test');
    });

    it('переданная функция является конструктором создаваемого класса', function() {
        var constructor = sinon.stub().returns({ field: 23 }),
            element;

        Classes.createClass('Test', constructor);
        element = new Classes.Test();

        assert.strictEqual(element.field, 23);
    });
});

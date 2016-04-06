describe('Element base', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Param', {

            public: {

                constructor: function(name, value) {
                    name && this.setName(name);
                    value && this.setValue(value);
                },

                setValue: function(value) {
                    this._value = value;
                    return this;
                },

                getValue: function() {
                    return this._value;
                },

                setName: function(name) {
                    this._name = name;
                    return this;
                },

                getName: function() {
                    return this._name;
                },

                toString: function() {
                    return this._toString();
                }

            },

            private: {

                _value: null,
                _name: 'default',

                _toString: function() {
                    return this._name + ': ' + this._value;
                }

            }

        });
    });

    it('по умолчанию поля инициализируются определёнными в декларации значениями', function() {
        var param = new Classes.Param();

        assert.strictEqual(param.getName(), 'default');
        assert.strictEqual(param.getValue(), null);
    });

    it('нет прямого доступа к приватным полям', function() {
        var param = new Classes.Param('param1', 10);

        assert.isUndefined(param._name);
        assert.isUndefined(param._value);

        assert.strictEqual(param.getName(), 'param1');
        assert.strictEqual(param.getValue(), 10);
    });

    it('приватные параметры невозможно перезаписать извне', function() {
        var param = new Classes.Param('param1', 10);

        param._name = 'param2';
        param._value = 20;

        assert.strictEqual(param.getName(), 'param1');
        assert.strictEqual(param.getValue(), 10);

        param.setName('param2');
        param.setValue(20);

        assert.strictEqual(param.getName(), 'param2');
        assert.strictEqual(param.getValue(), 20);
    });

    it('публичный интерфейс объекта неизменяем', function() {
        var param = new Classes.Param();

        param.setValue = 123;
        param.getValue = null;
        delete param.getName;

        assert.isFunction(param.setValue);
        assert.isFunction(param.getValue);
        assert.isFunction(param.getName);
    });

    it('возвращая this функции не расскрывают внутренней реализации класса', function() {
        var param = new Classes.Param('param', 10),
            _this = param.setValue(1);

        assert.isUndefined(_this._name);
        assert.isUndefined(_this._value);
        assert.strictEqual(_this, param);
    });

    it('работают стандартные методы объекта, определённые в публичном интерфейсе', function() {
        var param = new Classes.Param('param', 5),
            string = String(param);

        assert.strictEqual(string, 'param: 5');
    });

    it('объекты изменяются независимо друг от друга', function() {
        var param1 = new Classes.Param(),
            param2 = new Classes.Param();

        param2.setName('p');
        param2.setValue(true);

        assert.strictEqual(param1.getName(), 'default');
        assert.strictEqual(param1.getValue(), null);

        assert.strictEqual(param2.getName(), 'p');
        assert.strictEqual(param2.getValue(), true);
    });

    it.skip('с объектами корректно работает instanceof', function() {
        var param = new Classes.Param();

        assert.instanceOf(param, Classes.Param);
    });
});

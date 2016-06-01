describe('Classes._createConstructor', function() {
    var Classes, body;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
        Classes.setPrivate('copyProps', sinon.stub.returnsArg(0));
        Classes.setPrivate('testMode', false);
    });

    beforeEach(function() {
        body = {
            private: {
                _field: null
            },
            public: {
                getField: function() {
                    return this._field;
                },
                constructor: function(field) {
                    this._field = field;
                }
            }
        };
    });

    it('возвращает объект с конструкторами для каждой области видимости', function() {
        var F = Classes.createConstructor(body);
        assert.isFunction(F.public);
        assert.isFunction(F.private);
    });

    it.skip('создаваемый публичным конструктором объект содержит свойства публичной области видимости', function() {
        var F = Classes.createConstructor(body).public,
            obj = new F(123);

        assert.deepProperty(obj, 'getField');
    });

    it.skip('создаваемый публичным конструктором объект не содержит свойства приватной области видимости', function() {
        var F = Classes.createConstructor(body).public,
            obj = new F(123);

        assert.notDeepProperty(obj, '_field');
    });

    it.skip('поле constructor создаваемого объекта указывает на саму функцию-конструктор', function() {
        var F = Classes.createConstructor(body).public,
            obj = new F(123);

        assert.strictEqual(obj.constructor, F);
    });

    it.skip('при создании объекта вызывается публичный конструктор класса', function() {
        var spy = body.public.constructor = sinon.spy(),
            F = Classes.createConstructor(body).public,
            obj = new F(123); // jshint ignore:line

        assert.isTrue(spy.calledOnce);
    });
});
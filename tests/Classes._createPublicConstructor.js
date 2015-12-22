describe('Classes._createPublicConstructor', function() {

    var Classes, body;

    before(function() {

        Classes = getClasses();
        Classes.enableTestMode();
        Classes.setPrivate('_copyProps', function(body) { return body; })

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

    it('возвращает функцию', function() {

        var F = Classes.createPublicConstructor(body);
        assert.isFunction(F);

    });

    it('создаваемый конструктором объект содержит свойства публичной области видимости', function() {

        var F = Classes.createPublicConstructor(body),
            obj = new F(123);

        assert.deepProperty(obj, 'getField');

    });

    it('создаваемый конструктором объект не содержит свойства приватной области видимости', function() {

        var F = Classes.createPublicConstructor(body),
            obj = new F(123);

        assert.notDeepProperty(obj, '_field');

    });

    it('поле constructor создаваемого объекта указывает на саму функцию-конструктор', function() {

        var F = Classes.createPublicConstructor(body),
            obj = new F(123);

        assert.strictEqual(obj.constructor, F);

    });

    it('при создании объекта вызывается публичный конструктор класса', function() {

        body.public.constructor = sinon.spy();

        var F = Classes.createPublicConstructor(body),
            obj = new F(123);

        assert.isTrue(body.public.constructor.calledOnce);

    });

});

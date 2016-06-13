describe('Класс', function() {
    var Classes, guidBody;

    beforeEach(function() {
        Classes = getClasses();

        Classes.decl('Base');
        Classes.decl('Test');

        guidBody = {
            extend: Classes.Base,

            public: {
                init: function() {
                    throw new Error('создать экземпляр можно только с помощью метода getInstance');
                },

                getId: function() {
                    return this._id;
                },

                getStaticFields: function() {
                    return Object.keys(this.__self);
                }
            },

            private: {
                _id: 0,

                init: function() {
                    this._id = this.__self._next();
                }
            },

            staticPublic: {
                getInstance: function() {
                    return new this();
                },

                getInstanceFields: function() {
                    var instance = this.getInstance();
                    return Object.keys(instance);
                },

                getLast: function() {
                    return this._guid;
                }
            },

            staticPrivate: {
                _guid: 1,

                _next: function() {
                    return this._guid++;
                }
            }
        };

        Classes.decl('GUID', guidBody);
    });

    it('создаваемый класс является функцией', function() {
        assert.isFunction(Classes.GUID);
    });

    it('внешний статичный интерфейс класса соответствует заявленному', function() {
        var reference = {};

        // Определённые в staticPublic методы
        reference.getInstance = Classes.GUID.getInstance;
        reference.getInstanceFields = Classes.GUID.getInstanceFields;
        reference.getLast = Classes.GUID.getLast;

        // Стандартные методы
        reference.getBody = Classes.GUID.getBody;
        reference.getExtend = Classes.GUID.getExtend;
        reference.getFullName = Classes.GUID.getFullName;
        reference.getType = Classes.GUID.getType;
        reference.is = Classes.GUID.is;

        var classFields = Object.keys(Classes.GUID),
            referenceFields = Object.keys(reference);

        assert.deepEqual(classFields, referenceFields);
    });

    it('метод getBody возвращает тело класса', function() {
        assert.deepEqual(Classes.GUID.getBody(), guidBody);
    });

    it('метод getExtend возвращает базовый класс', function() {
        assert.strictEqual(Classes.GUID.getExtend(), Classes.Base);
    });

    it('метод getFullName возвращает полное имя класса', function() {
        assert.strictEqual(Classes.GUID.getFullName(), 'Classes.GUID');
    });

    it('метод getType возвращает Class', function() {
        assert.strictEqual(Classes.GUID.getType(), 'Class');
    });

    it('метод is возвращает true если класс унаследован от переданного в параметре', function() {
        assert.isTrue(Classes.GUID.is(Classes.Base));
    });

    it('метод is возвращает false если класс не унаследован от переданного в параметре', function() {
        assert.isFalse(Classes.GUID.is(Classes.Test));
    });

    it('из внешнего окружения нет доступа к приватным статическим полям', function() {
        assert.isUndefined(Classes.GUID._id);
        assert.isUndefined(Classes.GUID._next);
        assert.strictEqual(Classes.GUID.getLast(), 1);
    });

    it('из внешнего окружения невозможно переопределить приватные статические поля', function() {
        Classes.GUID._id = 5;
        assert.strictEqual(Classes.GUID.getLast(), 1);
    });

    it('изменение внешнего интерфейса никак не отражается на работе класса', function() {
        Classes.GUID.getInstance = function() {
            return null;
        };

        var instanceFields = Classes.GUID.getInstanceFields();

        assert.isArray(instanceFields);
        assert.include(instanceFields, 'constructor');
    });

    it('внутри статичного метода через this можно создать экземпляр класса', function() {
        var guid = Classes.GUID.getInstance(),
            reference = [
                'getId',
                'getStaticFields',
                'constructor'
            ];

        assert.deepEqual(Object.keys(guid), reference);
    });

    it('создаваемый через this в статичном методе экземпляр создаётся с помощью приватного конструктора', function() {
        var guid1 = Classes.GUID.getInstance(),
            guid2 = Classes.GUID.getInstance(),
            guid3 = Classes.GUID.getInstance();

        assert.strictEqual(guid1.getId(), 1);
        assert.strictEqual(guid2.getId(), 2);
        assert.strictEqual(guid3.getId(), 3);
    });

    it('экземпляр класса имеет доступ к приватной статичной области класса через __self', function() {
        var guid = Classes.GUID.getInstance(),
            reference = [
                'getInstance',
                'getInstanceFields',
                'getLast',
                'getBody',
                'getExtend',
                'getFullName',
                'getType',
                'is',
                '_guid',
                '_next',
                '__body',
                '__extend',
                '__fullName',
                '__type',
                '__extends'
            ];

        assert.deepEqual(guid.getStaticFields(), reference);
    });

    it('статичные методы имеею доступ к приватным полям объекта, создаваемого через this', function() {
        var instanceFields = Classes.GUID.getInstanceFields(),
            reference = [
                '_id',
                '__base',
                '__public',
                '__protected',
                '__self',
                'constructor'
            ];

        assert.deepEqual(instanceFields, reference);
    });

    it('возвращаемый из статичного метода экземпляр не раскрывает своей приватной области видимости', function() {
        assert.isUndefined(Classes.GUID.getInstance()._id);
    });
});

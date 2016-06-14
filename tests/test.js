describe('Тестирование', function() {
    var Classes;

    beforeEach(function() {
        Classes = getClasses();

        Classes.decl('StorageBase', {
            public: {
                getParams: function() {
                    return this._params;
                }
            },

            protected: {
                setParams: function(params) {
                    this._params = params;
                }
            },

            private: {
                _params: {}
            }
        });

        Classes.decl('Storage', {
            extend: Classes.StorageBase,

            public: {
                init: function(params) {
                    this.setParams(params);
                },

                toString: function() {
                    return this._toJson();
                }
            },

            private: {
                _toJson: function() {
                    return JSON.stringify(this.getParams());
                }
            }
        });
    });

    it('есть возможность застабить любое поле через getBody', function() {
        var body = Classes.Storage.getBody();
        body.private._toJson = sinon.stub().returns('json stub');

        var storage = new Classes.Storage({ p1: 1, p2: 2 });

        assert.strictEqual(String(storage), 'json stub');
        assert.calledOnce(body.private._toJson);
    });

    it('есть возможность застабить базовый класс через getBody', function() {
        Classes.name('Testing');
        Classes.Testing.decl('StorageBase', {
            public: {
                getParams: sinon.stub().returns({ key1: 'value1' }),
                setParams: sinon.stub()
            }
        });

        var body = Classes.Storage.getBody();
        body.extend = Classes.Testing.StorageBase;

        var storage = new Classes.Storage({ p1: 1, p2: 2 });

        assert.strictEqual(String(storage), '{"key1":"value1"}');
    });
});

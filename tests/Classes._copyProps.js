describe('Classes._copyProps', function() {

    var Classes;

    before(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает объект со свойствами, описывающими области доступа', function() {

        var props = Classes.copyProps({});

        assert.isObject(props);
        assert.isObject(props.private);
        assert.isObject(props.protected);
        assert.isObject(props.public);

    });

    it('клонирует свойства областей видимости из тела класса', function() {

        var body = {
                private: {
                    obj: { field: 1 }
                },
                protected: {
                    obj: { field: 2 }
                },
                public: {
                    obj: { field: 3 }
                }
            },
            props = Classes.copyProps(body);

        assert.deepEqual(props.private, body.private);
        assert.deepEqual(props.protected, body.protected);
        assert.deepEqual(props.public, body.public);

        props.private.obj.field = 3;
        assert.notEqual(props.private.obj.field, body.private.obj.field);

        props.protected.obj.field = 4;
        assert.notEqual(props.protected.obj.field, body.protected.obj.field);

        props.public.obj.field = 5;
        assert.notEqual(props.public.obj.field, body.public.obj.field);

    });

    it('устанавливает функциям класса в качестве контекста приватную область видимости', function() {

        var body = {
                private: {
                    _param: 123,
                    func: function() { return this._param; }
                },
                protected: {
                    func: function() { return this._param; }
                },
                public: {
                    func: function() { return this._param; }
                }
            },
            props = Classes.copyProps(body);

        assert.strictEqual(props.private.func(), 123);
        assert.strictEqual(props.protected.func(), 123);
        assert.strictEqual(props.public.func(), 123);

    });

    it('устанавливает приватной области видимости в виде прототипа защищённую', function() {

        var body = {
                private: {},
                protected: {}
            },
            props = Classes.copyProps(body);

        assert.strictEqual(props.private.__proto__, props.protected);

    });

    it('устанавливает защищённой области видимости в виде прототипа публичную', function() {

        var body = {
                protected: {},
                public: {}
            },
            props = Classes.copyProps(body);

        assert.strictEqual(props.protected.__proto__, props.public);

    });

});

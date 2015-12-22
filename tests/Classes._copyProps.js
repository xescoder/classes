describe('Classes._copyProps', function() {

    var Classes;

    beforeEach(function() {
        Classes = getClasses();
        Classes.enableTestMode();
    });

    it('возвращает объект со свойствами, описывающими области доступа', function() {

        var props = Classes.copyProps({});

        assert.isObject(props);
        assert.isObject(props.private);
        assert.isObject(props.public);

    });

    it('клонирует свойства областей видимости из тела класса', function() {

        var body = {
                private: {
                    obj: { field: 1 }
                },
                public: {
                    obj: { field: 2 }
                }
            },
            props = Classes.copyProps(body);

        assert.deepEqual(props.private, body.private);
        assert.deepEqual(props.public, body.public);

        props.private.obj.field = 3;
        assert.notEqual(props.private.obj.field, body.private.obj.field);

        props.public.obj.field = 5;
        assert.notEqual(props.public.obj.field, body.public.obj.field);

    });

    it('устанавливает функциям класса в качестве контекста приватную область видимости', function() {

        var body = {
                private: {
                    func: function() { return this; }
                },
                public: {
                    func: function() { return this; }
                }
            },
            props = Classes.copyProps(body);

        assert.strictEqual(props.private.func(), props.private);
        assert.strictEqual(props.public.func(), props.private);

    });

    it('устанавливает приватной области видимости в виде прототипа публичную', function() {

        var body = {
                private: {},
                public: {}
            },
            props = Classes.copyProps(body);

        assert.strictEqual(props.private.__proto__, props.public);

    });

});

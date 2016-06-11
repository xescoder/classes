describe('Экземпляр класса', function() {
    var Classes;

    before(function() {
        Classes = getClasses();

        Classes.decl('Sum', {
            public: {
                constructor: function() {
                    this.add.apply(this, arguments);
                },

                add: function() {
                    for (var i = 0; i < arguments.length; i++) {
                        this._add(Number(arguments[i]));
                    }

                    return this;
                },

                value: function() {
                    return this._sum;
                },

                valueOf: function() {
                    return this.value();
                },

                toString: function() {
                    return String(this.value());
                }
            },

            protected: {
                _add: function(num) {
                    this._sum += num;
                }
            },

            private: {
                _sum: 0
            }
        });
    });

    it('внешний интерфейс создаваемого экземпляра соответствует заявленому в public', function() {
        var sum = new Classes.Sum(),
            reference = {
                add: sum.add,
                value: sum.value,
                valueOf: sum.valueOf,
                toString: sum.toString,
                constructor: Classes.Sum
            };

        assert.deepEqual(sum, reference);
    });

    it('по умолчанию поля класса инициализируются определёнными в декларации значениями', function() {
        var sum = new Classes.Sum();
        assert.strictEqual(sum.value(), 0);
    });

    it('из внешнего окружения нет доступа к приватным и защищённым полям', function() {
        var sum = new Classes.Sum(1, 2);

        assert.isUndefined(sum._sum);
        assert.isUndefined(sum._add);

        assert.strictEqual(sum.value(), 3);
    });

    it('приватные и защищённые поля невозможно перезаписать из внешнего окружения', function() {
        var sum = new Classes.Sum(1, 2);

        sum._sum = -4;
        sum._add = _.noop;

        sum.add(5);

        assert.strictEqual(sum.value(), 8);
    });

    it('невозможно изменить публичный интерфейс экземпляра', function() {
        var sum = new Classes.Sum(1, 2);

        sum.value = 123;
        delete sum.add;

        assert.isFunction(sum.value);
        assert.isFunction(sum.add);

        sum.value = function() { return -1; };

        assert.strictEqual(sum.value(), 3);
    });

    it('возвращая this функции возвращают публичный интерфейс экземпляра', function() {
        var sum = new Classes.Sum(),
            reference = {
                add: sum.add,
                value: sum.value,
                valueOf: sum.valueOf,
                toString: sum.toString,
                constructor: sum.constructor
            };

        sum = sum.add(1);

        assert.deepEqual(sum.add(1), reference);
    });

    it('экземпляр позволяет построить цепочку вызовов своих функций без потери приватного контекта', function() {
        var sum = new Classes.Sum();

        sum = sum
            .add(1)
            .add(2)
            .add(3)
            .add(4);

        assert.strictEqual(sum.value(), 10);
    });

    it('возвращая this функции не раскрываю приватного и защищённого контекста экземпляра', function() {
        var sum = new Classes.Sum();

        sum = sum.add(1);

        assert.isUndefined(sum._sum);
        assert.isUndefined(sum._add);
    });

    it('корректно работает приведение с помощью valueOf, определённом в публичном интерфейсе класса', function() {
        var sum = new Classes.Sum(1, 2, 3);

        assert.strictEqual(Number(sum), 6);
        assert.strictEqual(+sum, 6); // jscs:disable
    });

    it('корректно работает приведение c помощью toString, определённом в публичном интерфейсе класса', function() {
        var sum = new Classes.Sum(1, 2, 3);

        assert.strictEqual(String(sum), '6');
        assert.strictEqual(sum + '', '6'); // jscs:disable
    });

    it('экземпляры класса изменяются независимо друг от друга', function() {
        var sum1 = new Classes.Sum(),
            sum2 = new Classes.Sum();

        sum1.add(1).add(2);
        sum2.add(3).add(4);

        assert.strictEqual(sum1.value(), 3);
        assert.strictEqual(sum2.value(), 7);
    });
});

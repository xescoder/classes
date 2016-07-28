# Classes

Эксперимент с реализацией полноценного ООП фрейморка в JavaScript. Представляет из себя фабрику классов `Classes`. Позволяет создавать наследуемые классы с неизменяемыми private свойствами.

## Публичное API фабрики

### Classes
* **decl(ClassName, declaration)** - декларирует новый класс. Созданный класс будет доступен как `Classes.ClassName`;
* **name(Namespace)** - создаёт новое пространство имён, доступное как `Classes.Namespace`. В созданном пространстве имён можно создавать вложенные пространства и классы;
* **is(obj, Type)** - проверяет унаследованность объекта от определённого типа (класса);
* **getType(obj)** - возвращает название типа объекта.

### Поля декларации класса
* **public** - публичные члены экземпляра класса;
* **private** - приватные члены экземпляра класса;
* **protected** - защищённые (доступные только из экземпляров самого класса и его наследников) члены экземпляра класса;
* **extend** - от какого класса унаследован;
* **staticPublic** - статичные публичные поля;
* **staticPrivate** - статичные приватные поля;

## Примеры
```js
// Создаём пространство имён
Classes.name('Examples');

// Декларируем класс
Classes.Examples.decl('Simple', {
    public: {
        init: function(name) {
            this.name = name;
        },

        toString: function() {
            return `Hello ${this.name}!!!`;
        }
    },

    private: {
        name: ''
    }
});

// Создаём экземпляр класса
var example = new Classes.Examples.Simple('world');
console.log(String(example)); // Hello world!!!

// Пытаемся получить доступ к приватному полю
console.log(example.name); // undefined
```

Больше примеров: [examples](https://github.com/xescoder/classes/tree/master/examples). 

Ещё больше примеров: [тесты](https://github.com/xescoder/classes/tree/master/tests).

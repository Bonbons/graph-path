class Foo {
    #bar;

    constructor(bar) {
        this.#bar = bar;
    }

    get bar() {
        return this.#bar;
    }
}

exports.Test = (bar) => new Foo(bar);
class Foo {
    #bar;

    constructor(bar) {
        this.#bar = bar;
    }

    get bar() {
        return this.#bar;
    }
}

exports.newTest = (bar) => new Foo(bar);
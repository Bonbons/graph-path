export class Test {
    #foo
    constructor (bar) {
        this.#foo = bar;
    }

    getFoo() {
        return this.#foo;
    }
}
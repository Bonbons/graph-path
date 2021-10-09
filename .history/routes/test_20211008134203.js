class Connection {
    #nb = 0;

    constructor() {}

    get nb() {
        return this.#nb;
    }

    add() {
        this.#nb++;
    }
}

exports.newTest = (bar) => new Connection(bar);
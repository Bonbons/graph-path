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

exports.newConnection = (nb) => new Connection(nb);
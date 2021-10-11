const { createMachine, interpret, assign } = require('xstate');
var { newConnection } = require('./connection');

exports.initialMachine = {
    id: 'login',
    initial: 'login',
    states: {
    login: {
        on: {
        LOGIN: {
            target: 'run',
            actions: (context, event) => {
            console.log('************************************');
            context.connection.add();
            console.log('connection', context.connection.nb);
            console.log('************************************');
            }
        }
        }
    },
    run: {
        on: {
        JUMP: {
            target: 'fall',
            actions: assign({
            falls: (context, event) => context.falls + 1
            })
        },
        DUCK: 'walk'
        }
    },
    walk: {
        on: {
        TURN: 'success',
        RUN: 'run'
        }
    },
    success: {
        type: 'final'
    },
    fall: {
        on: {
        GETUP: 'run'
        }
    }
    }
};

exports.createMachineWithContext = (initialMachine, context) => createMachine(initialMachine).withContext(context);
var express = require('express');
const { has, isNil, isEmpty } = require('lodash');
const { createMachine, interpret, assign } = require('xstate');
var router = express.Router();
var { newConnection } = require('./connection');

// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)
  
const fetchMachine = (connection) => createMachine({
  id: 'login',
  initial: 'login',
  context: {
    connection: connection,
    falls: 0
  },
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
        JUMP: 'success',
        FALL: {
          target: 'failure',
          actions: assign({
            retriesJump: (context, event) => context.falls + 1
          })
        }
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        UP: 'run'
      }
    }
  }
});

var machineServices = {};

function sessionCheck(req, res, next) {
  if(!req.session.machineService){
    if (!has(machineServices, req.session.id)) {
      machineServices[req.session.id]  = interpret(fetchMachine(newConnection())).onStop(() => {
          console.log('STOP', req.session.id)
        }).onTransition((state) =>
          console.log('NEW STATE', state.value)
        );
    }
    machineServices[req.session.id].start();
  }
  req.session.machineService = machineServices[req.session.id];
}
  
/* GET home page. */
router.get('/', function(req, res, next) {
  sessionCheck(req, res, next);
  console.log(req.body);
  if (has(req, 'query.action') && !isNil(req.query.action) && req.query.action.trim().length > 0) {
    console.log('send', req.query.action);
    if (req.query.action === 'LOGOUT') {
      req.session.machineService.start();
    } else {
      req.session.machineService.send(req.query.action);      
    }
  }
  var data = { title: req.session.machineService.state.value };
  data['actions'] = fetchMachine(0).events.filter(e => req.session.machineService.state.can(e));
  if (isEmpty(data.actions)) {
    data.actions.push('LOGOUT');
  }
  data['context'] = req.session.machineService.state.context;
  console.log(data);
  if(data.context.connection.nb){
    if (req.session.machineService.state.value !== 'login') {
      data['message'] = `You're trying ${data.context.connection.nb} times`;
    } else {
      data['message'] = `You already try ${data.context.connection.nb} times`;
    }
  } else {
    data['message'] = `Welcome to this page for the first time!`;
  }
  Object.keys(machineServices).forEach(cle => console.log(cle, machineServices[cle].state.value))
  res.render('index', data);
});

module.exports = router;

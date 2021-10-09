var express = require('express');
const { has, isNil, isEmpty } = require('lodash');
const { createMachine, interpret, assign } = require('xstate');
var router = express.Router();

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
  
const fetchMachine = (contextInitial) => createMachine({
  id: 'login',
  initial: 'login',
  context: contextInitial,
  states: {
    login: {
      on: {
        LOGIN: {
          target: 'run',
          actions: assign({
            retries: (context, event) => {
              context.retriesJump = 0;
              return context.retries + 1;
            }
          })
        }
      }
    },
    run: {
      on: {
        JUMP: 'success',
        FALL: 'failure'
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        UP: {
          target: 'run',
          actions: assign({
            retriesJump: (context, event) => context.retriesJump + 1
          })
        }
      }
    }
  }
});

var machineServices = {};

function sessionCheck(req, res, next) {
  if(!req.session.machineService){
    if (!has(machineServices, req.session.id)) {
      machineServices[req.session.id]  = interpret(fetchMachine({
        retries: 0,
        retriesJump: 0
      })).onStop(() => {
          console.log('STOP', this.data.context)
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
      req.session.machineService.stop();
      req.session.machineService.start();
    } else {
      req.session.machineService.send(req.query.action);      
    }
  }
  data = { title: req.session.machineService.state.value };
  data['actions'] = fetchMachine.events.filter(e => req.session.machineService.state.can(e));
  if (isEmpty(data.actions)) {
    data.actions.push('LOGOUT');
  }
  data['context'] = req.session.machineService.state.context;
  console.log(data);
  if(req.session.page_views){
    data['message'] = `You visited this page ${req.session.page_views} times`;
  } else {
    data['message'] = `Welcome to this page for the first time!`;
  }
  Object.keys(machineServices).forEach(cle => console.log(cle, machineServices[cle].state.value))
  res.render('index', data);
});

module.exports = router;

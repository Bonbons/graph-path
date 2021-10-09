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
  
  const fetchMachine = createMachine({
    id: 'start',
    initial: 'start',
    context: {
      retries: 0
    },
    states: {
      start: {
        on: {
          BEGIN: 'run'
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
          RETRY: {
            target: 'run',
            actions: assign({
              retries: (context, event) => context.retries + 1
            })
          }
        }
      }
    }
  });
const promiseService = interpret(fetchMachine).onTransition((state) =>
  console.log(state.value)
);
promiseService.start();


  

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body);
  if (has(req, 'query.action') && !isNil(req.query.action) && req.query.action.trim().length > 0) {
    console.log('send', req.query.action);
    if (req.query.action === 'RESTART') {
      promiseService.stop();
      promiseService.start();
    } else {
      promiseService.send(req.query.action);      
    }
  }
  data = { title: promiseService.state.value };
  data['actions'] = fetchMachine.events.filter(e => promiseService.state.can(e));
  if (isEmpty(data.actions)) {
    data.actions.push('RESTART');
  }
  data['context'] = promiseService.state.context;
  console.log(data);
  res.render('index', data);
});

module.exports = router;

'use strict';

const fs = require('fs');
const path = require('path');
const Execution = global.ExecutionClass;

class scriptExecutor extends Execution {
  constructor(process) {
    super(process);
  }

  async runFork(script, args) {
    let _this = this;
    let endOptions = {
      end: 'end'
    };
    const cp = require('child_process');
    const fork = cp.fork(path.resolve(__dirname, 'fork.js'), [script]);

    fork.send(args || {});

    fork.on('message', (m) => {
      if (m.type && m.type == 'error') {
        endOptions.end = 'error';
        endOptions.messageLog = `executeScript: ${m.message}`;
        endOptions.err_output = `executeScript: ${m.message}`;
        _this.end(endOptions);
      } else {
        //STANDARD OUPUT:
        if (typeof m.output === 'string') {
          endOptions.data_output = m.output;
          endOptions.msg_output = m.output;
        } else if (m.output instanceof Object) {
          endOptions.data_output = m.output;
          endOptions.msg_output = '';
          endOptions.extra_output = {};
          for (const key in m.output) {
            if (m.output[key] instanceof Object || m.output[key] instanceof Array) {
              endOptions.extra_output[key] = JSON.stringify(m.output[key]);
            } else {
              endOptions.extra_output[key] = m.output[key];
            }
          }
        } else {
          endOptions.data_output = m.output;
          endOptions.msg_output = m.output;
        }
        _this.end(endOptions);
      }
    });
  }

  exec(params) {
    let _this = this;
    let endOptions = {
      end: 'end'
    };

    // MAIN:
    if (params.script) {
      this.runFork(params.script, params.args);
    } else {
      if (params.script_file) {

        if (fs.existsSync(params.script_file)) {
          try {
            params.script = fs.readFileSync(params.script_file);
            this.runFork(params.script, params.args);
          } catch (err) {
            endOptions.messageLog =
              `executeScript reading script_file ${params.script_file}: ${err}`;
            endOptions.err_output =
              `executeScript reading script_file ${params.script_file}: ${err}`;
            _this.end(endOptions);
          }

        } else {
          endOptions.end = 'error';
          endOptions.messageLog =
            `executeScript no such script_file: ${params.script_file}`;
          endOptions.err_output =
            `executeScript no such script_file: ${params.script_file}`;
          _this.end(endOptions);
        }

      } else {
        endOptions.end = 'error';
        endOptions.messageLog =
          'executeScript dont have script or script_file';
        endOptions.err_output =
          'executeScript dont have script or script_file';
        _this.end(endOptions);
      }
    }
  }
}

module.exports = scriptExecutor;
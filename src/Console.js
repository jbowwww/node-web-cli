import React from 'react';
import { Button } from 'reactstrap';
import ConsoleOutput from './ConsoleOutput.js'
import makeRef from './makeref.js';
import './Console.css';

export default class Console extends React.Component {

  constructor(props) {
      super(props);
      this.cmd = makeRef();
			this.sendCmdButton = makeRef();
      this.consoleOutput = makeRef();
      this.updateCommand = this.updateCommand.bind(this);
      this.checkForEnterKey = this.checkForEnterKey.bind(this);
      this.sendCmd = this.sendCmd.bind(this);
      this.cmdHistory = [];
      this.state = {
          cmd: ''
      };
  }

  componentDidMount() {
			this.cmd.current.focus();
  }

  updateCommand(e) {
      this.setState({ cmd: e.target.value || '' });
  }

  checkForEnterKey(e) {
      if ((e.which || e.keyCode) === 13) {
          e.preventDefault();
          this.sendCmd();
      }
  }

  sendCmd() {
      this.cmdHistory.push(this.state.cmd);
      console.log('sendCmd()', 'state', this.state, 'this', this, 'this.cmd.current.value', this.cmd.current.value);
      this.props.ws.send(this.state.cmd);
  }

	appendOutput(output) {
		this.consoleOutput.current.append(output);
	}
	
  render() {
    return (
			<div className="console-container">
	      <div className="console-input-container">
	        <input type="text" id="cmd" ref={this.cmd} onChange={this.updateCommand} onKeyPress={this.checkForEnterKey} onBlur={()=>this.cmd.current.focus()} />
	        <Button ref={this.sendCmdButton} id="btnRun" color="secondary" size="sm" onClick={this.sendCmd}>Send Command</Button>
	      </div>
	      <div className="console-output-container">
	        <ConsoleOutput ref={this.consoleOutput} />
	      </div>
			</div>
  	);
	}
}

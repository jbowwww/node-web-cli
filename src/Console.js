import React from 'react';
import { Button } from 'reactstrap';
import makeRef from './makeref.js';
import _ from 'lodash';
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
		this.appendOutput = this.appendOutput.bind(this);
    this.cmdHistory = [];
    this.state = {
      cmd: '',
			messages: []
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
		if (Array.isArray(output)) {
			_.forEach(output, m => this.appendOutput(m));
		} else {
			if (typeof output === 'string') {
					output = { message: output };
			} else if (typeof output !== 'object') {
					throw new TypeError('output should be an object or a string or an array of either');
			}
			output.tsLocal || (output.tsLocal = new Date());
			output.type || (output.type = 'stdout');
			output.message || (output.message = '');
			this.setState({ messages: this.state.messages.concat([output]) });
			this.consoleOutput.current.scrollTo(0, this.consoleOutput.current.scrollHeight);
		}
	}

  render() {
    return (
			<div className="console-container">
	      <div className="console-input-container">
	        <input type="text" id="cmd" ref={this.cmd} onChange={this.updateCommand} onKeyPress={this.checkForEnterKey} onBlur={()=>this.cmd.current.focus()} />
	        <Button ref={this.sendCmdButton} id="btnRun" color="secondary" size="sm" onClick={this.sendCmd}>Send Command</Button>
	      </div>
	      <div className="console-output-container">
					<ul ref={this.consoleOutput} className="console-output">
						{_.map(this.state.messages, msg => {
							//var ts = msg.ts.split('T', 2);  //ts[0]}<br/>{ts[1]}
							return (<li key={'cmd-' + msg.ts}>
								<span className="console-msg-ts">{msg.ts.substring(msg.ts.indexOf('T')+1)}</span>
								<span className="console-msg-type">{msg.type}</span>
								<span className="console-msg-message">{msg.message}</span>
							</li>);
						})}
					</ul>
	      </div>
			</div>
  	);
	}
}

import React from 'react';
import { Button } from 'reactstrap';
import makeRef from './makeref.js';
import _ from 'lodash';
import './Console.css';

export default class Console extends React.Component {

	constructor(props) {
		super(props);
		this.cmd = makeRef();
		this.execButton = makeRef();
    	this.consoleOutput = makeRef();
	    this.updateCommand = this.updateCommand.bind(this);
	    this.checkForEnterKey = this.checkForEnterKey.bind(this);
	    this.execCmd = this.execCmd.bind(this);
		this.appendOutput = this.appendOutput.bind(this);
	    this.state = {
			messages: [],			// output messages
			cmdHistory: [],			// command history/recall buffer (up/dn arrow keys)
			cmdHistoryIndex: -1		// when >= 0, index into this.state.cmdHistory selected by up/dn arrows
		};
	}

	componentDidMount() {
		this.cmd.current.focus();
	}

	updateCommand(e) {
    	this.setState({ cmd: e.target.value || '' });
	}

	checkForEnterKey(e) {
		var key = e.which || e.keyCode;
		var cmdHistoryIndex = this.state.cmdHistoryIndex;
		switch (key) {
    		case 13:	// enter
	    		this.execCmd();
				e.preventDefault();
	    		break;
			case 38:	// up arrow
				e.preventDefault();
				if (cmdHistoryIndex < this.state.cmdHistory.length - 1) {
					this.cmd.current.value = this.state.cmdHistory[this.state.cmdHistory.length - 1 - (++cmdHistoryIndex)];
					this.setState({ cmdHistoryIndex });
				}
				break;
			case 40:	// dn arrow
				e.preventDefault();
				if (cmdHistoryIndex >= 0) {
					this.cmd.current.value = --cmdHistoryIndex < 0 ? '' : this.state.cmdHistory[this.state.cmdHistory.length - 1 - cmdHistoryIndex];
					this.setState({ cmdHistoryIndex });
				}
				break;
			default: break;
    	}
	}

	execCmd() {
		var cmd = this.cmd.current.value;
		console.log('execCmd()', 'this', this, 'this.cmd.current.value', cmd);
		if (cmd !== '') {
			this.setState({ cmdHistory: this.state.cmdHistory.concat([cmd]) });
			this.props.ws.send(cmd);
			this.cmd.current.value = '';
		}
		this.setState({ cmdHistoryIndex: -1 });	// reset command history recall buffer index
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
			        <input ref={this.cmd} type="text" className="console-cmd"
						onBlur={()=>this.cmd.current.focus()}
						onKeyUp={this.checkForEnterKey} />
					<span>{this.state.cmdHistoryIndex}</span>
			        <Button ref={this.execButton} color="secondary" size="sm"
						onClick={this.execCmd}>Send Command</Button>
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

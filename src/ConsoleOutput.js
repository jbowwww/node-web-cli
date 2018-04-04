import React from 'react';
import _ from 'lodash';
import makeRef from './makeref.js';
import './ConsoleOutput.css';

class ConsoleOutput extends React.Component {
    constructor(props) {
        super(props);
				this.consoleOutputUL = makeRef();
        this.append = this.append.bind(this);
        this.state = { messages: [] };
    }

    append(msg) {
        if (Array.isArray(msg)) {
            _.forEach(msg, m => this.append(m));
        } else {
            if (typeof msg === 'string') {
                msg = { message: msg };
            } else if (typeof msg !== 'object') {
                throw new TypeError('msg should be an object or a string or an array of either');
            }
            msg.tsLocal || (msg.tsLocal = new Date());
            msg.type || (msg.type = 'stdout');
            msg.message || (msg.message = '');
            this.setState({ messages: this.state.messages.concat([msg]) });
						this.consoleOutputUL.current.scrollTo(0, this.consoleOutputUL.current.scrollHeight);
        }
    }

    render() {
        return (
            <ul ref={this.consoleOutputUL} className="console-output">
                {_.map(this.state.messages, msg => {
                    //var ts = msg.ts.split('T', 2);  //ts[0]}<br/>{ts[1]}
                    return (<li key={'cmd-' + msg.ts}>
                        <span className="console-msg-ts">{msg.ts.substring(msg.ts.indexOf('T')+1)}</span>
                        <span className="console-msg-type">{msg.type}</span>
                        <span className="console-msg-message">{msg.message}</span>
                    </li>);
                })}
            </ul>
        );
    }
}

export default ConsoleOutput;

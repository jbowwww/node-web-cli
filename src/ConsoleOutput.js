import React from 'react';
import _ from 'lodash';
import './ConsoleOutput.css';

class ConsoleOutput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
        this.append = this.append.bind(this);
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
        }
    }

    render() {
        return (
            <ul className="console-output">
                {_.map(this.state.messages, msg => {
                    //var ts = msg.ts.split('T', 2);  //ts[0]}<br/>{ts[1]}
                    return (<li key={'cmd-' + msg.ts}>
                        <span className="console-msg-ts">{msg.ts}</span>
                        <span className="console-msg-type">{msg.type}</span>
                        <span className="console-msg-message">{msg.message}</span>
                    </li>);
                })}
            </ul>
        );
    }
}

export default ConsoleOutput;

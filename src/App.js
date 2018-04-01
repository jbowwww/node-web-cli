import React from 'react';
import ConsoleOutput from './ConsoleOutput.js'
import makeRef from './makeref.js';
import logo from './logo.svg';
import './App.css';

//var bind =

class App extends React.Component {

    constructor(props) {
        super(props);
        this.consoleOutput = makeRef();
    }

    componentDidMount() {
        var ws = new WebSocket('ws://127.0.0.1:8080');
        ws.onmessage = msg => this.consoleOutput.current.append(JSON.parse(msg.data));
        this.setState({ ws, cmd: '' });
        console.log('componentDidMount', 'state', this.state, 'this', this, 'this.consoleOutput', this.consoleOutput);
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
        console.log('sendCmd()', 'state', this.state, 'this', this);
        this.state.ws.send(this.state.cmd);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <input type="text" id="cmd"
                        onChange={this.updateCommand.bind(this)}
                        onKeyPress={this.checkForEnterKey.bind(this)} />
                    <button id="btnRun" onClick={this.sendCmd.bind(this)}>
                        <label htmlFor="btnRun">Send Command</label>
                    </button>
                </header>
                <content className="App-intro">
                    <ConsoleOutput ref={this.consoleOutput} />
                </content>
            </div>
        );
    }
}

export default App;

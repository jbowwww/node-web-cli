import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import ConsoleOutput from './ConsoleOutput.js'
import makeRef from './makeref.js';
import logo from './logo.svg';
import './App.css';

import innerClassnames from 'classnames';
const classnames = (...args) => innerClassnames(...args) + ' nav-tab';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.cmd = makeRef();
				this.sendCmdButton = makeRef();
        this.consoleOutput = makeRef();
        this.toggle = this.toggle.bind(this);
        this.updateCommand = this.updateCommand.bind(this);
        this.checkForEnterKey = this.checkForEnterKey.bind(this);
        this.sendCmd = this.sendCmd.bind(this);
        this.cmdHistory = [];
        this.state = {
            ws: null,
            cmd: '',
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    componentDidMount() {
        var ws = new WebSocket('ws://127.0.0.1:8080');
        ws.onmessage = msg => this.consoleOutput.current.append(JSON.parse(msg.data));
        this.setState({ ws });
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
        this.cmdHistory.push(this.state.cmd);
        console.log('sendCmd()', 'state', this.state, 'this', this, 'this.cmd.current.value', this.cmd.current.value);
        this.state.ws.send(this.state.cmd);
    }

    render() {
      return (
        <div className="App">
          <Nav tabs>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => this.toggle('1')}>Console</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => this.toggle('2')}>Diagnostics</NavLink>
            </NavItem>
          </Nav>
        	<TabContent activeTab={this.state.activeTab}>
          	<TabPane tabId="1">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <input type="text" id="cmd" ref={this.cmd} onChange={this.updateCommand} onKeyPress={this.checkForEnterKey} />
                <Button ref={this.sendCmdButton} id="btnRun" color="secondary" size="sm" onClick={this.sendCmd}>Send Command</Button>
              </header>
              <content className="App-content">
                <ConsoleOutput ref={this.consoleOutput} />
              </content>
	          </TabPane>
	          <TabPane tabId="2">
	            <Row>
	              <Col sm="6">
	                <Card body>
	                  <CardTitle>Special Title Treatment</CardTitle>
	                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
	                  <Button>Go somewhere</Button>
	                </Card>
	              </Col>
	              <Col sm="6">
	                <Card body>
	                  <CardTitle>Special Title Treatment</CardTitle>
	                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
	                  <Button>Go somewhere</Button>
	                </Card>
	              </Col>
	            </Row>
	          </TabPane>
      	</TabContent>
      </div>
    );
  }
}

export default App;

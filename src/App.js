import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import Console from './Console.js'
import makeRef from './makeref.js';
import logo from './logo.svg';
import './App.css';

import innerClassnames from 'classnames';
const classnames = (...args) => innerClassnames(...args) + ' nav-tab';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.console = makeRef();
    this.toggle = this.toggle.bind(this);
		this.ws = new WebSocket('ws://127.0.0.1:8080');

		this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  componentDidMount() {
    this.ws.onmessage = msg => this.console.current.appendOutput(JSON.parse(msg.data));
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
					<img src={logo} className="App-logo" alt="logo" />
        </Nav>
      	<TabContent activeTab={this.state.activeTab}>
        	<TabPane tabId="1">
            <Console ref={this.console} ws={this.ws} />
          </TabPane>
          <TabPane tabId="2">

					</TabPane>
    		</TabContent>
    	</div>
  	);
	}
}

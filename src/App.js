import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import Console from './Console.js'
import makeRef from './makeref.js';
import classnames from 'classnames';
import logo from './logo.svg';
import './App.css';


export default class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.console = makeRef();
	    this.toggle = this.toggle.bind(this);
		this.ws = new WebSocket(this.props.cmdServer);//'ws://127.0.0.1:8080');
		this.ws.onmessage = msg => this.console.current.appendOutput(JSON.parse(msg.data));
		this.state = { activeTab: '1' };
	}

	toggle(tab) {
	    if (this.state.activeTab !== tab) {
	    	this.setState({ activeTab: tab });
	    }
	}

	activeTabClassName(tab) {
		var activeTab = this.state.activeTab;
		// using == should perform type conversion between ints and strings representing ints (unlike ===)
		return classnames({ active: activeTab === tab || activeTab === tab.toString() }) + ' nav-tab';
	}

	componentDidMount() { }

	render() {
    	return (
			<div className="App">
	        	<Nav tabs>
					<div className="App-cmd-server"><div>cmdServer: {this.props.cmdServer}</div></div>
		          	<NavItem>
						<NavLink className={this.activeTabClassName(1)} onClick={() => this.toggle('1')}>Console</NavLink>
		        	</NavItem>
		        	<NavItem>
		        		<NavLink className={this.activeTabClassName(2)} onClick={() => this.toggle('2')}>Diagnostics</NavLink>
		    		</NavItem>
					<img src={logo} className="App-logo" alt="logo" />
		        </Nav>
	      		<TabContent activeTab={this.state.activeTab}>
		        	<TabPane tabId="1">
		            	<Console ref={this.console} ws={this.ws} />
		        	</TabPane>
	          		<TabPane tabId="2">
						&nbsp;
					</TabPane>
	    		</TabContent>
    		</div>
		);
	}
}

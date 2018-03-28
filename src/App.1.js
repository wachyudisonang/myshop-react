import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Container,
    Row,
    Col,
    Jumbotron,
	Button,
	Table,
	Alert
} from 'reactstrap';
import axios from 'axios';
import NavbarSection from './components/navbar';
import AddProduct from './components/AddProduct';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
		  text: "Old Text",
		  id: 0
		};
		this.onClick = this.handleClick.bind(this);
	  }
	
	  handleClick(event) {
		const {id} = event.target;
		console.log(id);
	
		this.setState({
		   text: "New text",
		   id: 1
		});
	  }
	
	  render() {
		 return (	
			 <h3 id={this.state.id} onClick={this.onClick}>{this.state.text}</h3>
	  )};
}

export default App;
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
	constructor(props) {
        super(props);
        this.state = {
            shown: true,
            products: [],
			purchases: [],
			currentFilter: null,
			filterBy: '',
            selectedOption: '',
            selectedOption2: ''
		}
		this.handleClick = this.handleClick.bind(this);
    }

    toggle() {
		this.setState({
			shown: !this.state.shown
		});
	}
    
    componentDidMount() {
        /* fetch API in action */
        axios.get('http://192.168.0.234:8000/api/products')
            .then(function (response) {
                return response;
            })
            .then(products => {
                //Fetched product is stored in the state
                this.setState({ products: products.data });
            });
        axios.get('http://192.168.0.234:8000/api/purchases')
            .then(function (response) {
                return response;
            })
            .then(purchases => {
                //Fetched product is stored in the state
                this.setState({ purchases: purchases.data });
            });
    }

    renderDataSource(product, index) {
        return (
            <li key={product.id} onClick={
                () =>this.handleClick(product)} >
                { product.name } 
            </li>
        )
    }
	
	handleClick = (entity, id) => {
		if (!this.state.currentFilter || !entity ) {
			this.toggle();
		}
		
		this.setState({currentFilter:entity});
		this.setState({filterBy:id});

		// axios.get('http://192.168.0.234:8000/api/purchases/'+entity+'/'+id)
        //     .then(function (response) {
        //         return response;
        //     })
        //     .then(products => {
        //         //Fetched product is stored in the state
        //         this.setState({ purchases: products.data });
        //     })
	}

	showLink = (category, data) => {
		if (!data) { // evaluates to true if data is null
			return '-'; 
		}
		return (
			<a href="#" onClick={() => this.handleClick(category, data)}>
				{ category==='id' ? 'See' : data }
			</a>
		);
	};

    renderMainData() {
		// let unitPrice = Math.floor(100000 + Math.random() * 900000);
		// let qty = Math.floor((Math.random() * 10) + 1);
		return this.state.purchases
			.filter((purchase, by) => {
				if (!this.state.currentFilter) {
					return true;
				}
				return purchase[this.state.currentFilter] === this.state.filterBy
			})
			.map((purchase, index) => {
				let unit = !purchase.unit ? '' : purchase.unit
				let packSize = !purchase.pack_size ? '-' : purchase.pack_size +' '+ unit
				
				return (
					<tr key={ purchase.index } >
						<th scope="row">{index+1}</th>
						<td>{ this.showLink('category', purchase.category) }</td>
						<td>{ this.showLink('name', purchase.name) }</td>
						<td>{ packSize }</td>
						<td>{ purchase.unit_price }</td>
						<td>{ purchase.qty }</td>
						<td>{ this.showLink('date', purchase.date) }</td>
						<td>{ this.showLink('id', purchase.id) }</td>
					</tr>
				)
			})
    }

    renderData(product, index) {
        return (
            { value: product.ID, label: product.name }
        )
    }
    renderData2(product, index) {
        return (
            { value: product.ID, label: product.name }
        )
    }

    plus = (selectedOption2) => {
        this.setState({ selectedOption2 });
        console.log(`Selected: ${selectedOption2.label}`);
    }

    handleChange = (selectedOption) => {
        // console.log(`selectedOption: ${selectedOption.label}, plus: ${plus}`)
        this.toggle();
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);
    }
    
    handleChangeProduct = (selectedOption2) => {
        // this.toggle();
        this.setState({ selectedOption2 });
        console.log(`Selected: ${selectedOption2.label}`);
    }

    handleAddProduct(product) {
        axios({
            method: 'POST',
            url: 'http://192.168.0.234:8000/api/products',
            data: JSON.stringify(product),
            config: { headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}
        })
        .then(response => {
            return response.json();
        })
        .then( data => {
           
            this.setState((prevState)=> ({
                products: prevState.products.concat(data),
                currentFilter : data
            }))
        })
    }

    render() {
        var shown = {
			display: this.state.shown ? "block" : "none"
		};
		
		var hidden = {
			display: this.state.shown ? "none" : "block"
        }

        const { selectedOption } = this.state;
        const { selectedOption2 } = this.state;
        const value = selectedOption && selectedOption.value;
        const value2 = selectedOption2 && selectedOption2.value2;

        return (
            <div>
                <NavbarSection cart="15" />
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col>
                                <h1>Search</h1>
                                <Select.Creatable
                                    name="form-field-name"
                                    value={value}
                                    onChange={this.handleChange}
                                    options={ this.state.products.map(this.renderData) }
                                />
                            </Col>
                        </Row>
                    </Container>
                    
                    <Container style={ hidden }>
                        <h3>Add New Product</h3>
                        <AddProduct onAdd={this.handleAddProduct} />
                        {/* Category: <Select.Creatable
                                    name="form-field-name-product"
                                    value={value2}
                                    onChange={this.plus}
                                    options={ this.state.products.map(this.renderData2) }
                                />
                        Name: {this.state.selectedOption.label} */}
                    </Container>
                </Jumbotron>
				<Container>
					<h1>Last Purchased</h1>
					<Alert color="primary" style={ hidden }>
						<h4 className="alert-heading">Filter active!</h4>
						By { this.state.currentFilter }: { this.state.filterBy }
						<hr />
						<p className="mb-0">
						<a href="#" className="alert-link" onClick={() => this.handleClick()}>Clear Filter</a>
						</p>
					</Alert>
					<Row>
						<Col>
							<div>
							<Table>
								<thead>
								<tr>
									<th>#</th>
									<th>Category</th>
									<th>Name</th>
									<th>Pack Size</th>
									<th>Unit Price</th>
									<th>Qty</th>
									<th>Date</th>
									<th>Details</th>
								</tr>
								</thead>
								<tbody>
								{ this.renderMainData() }
								{/* { console.log(this.state.purchases) } */}
								</tbody>
							</Table>
							</div>
						</Col>
					</Row>
				</Container>
            </div>
        );
    }
}

export default App;
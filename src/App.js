import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Container,
    Row,
    Col,
    Jumbotron,
    Button
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
            selectedOption: '',
            selectedOption2: ''
        }
    }

    toggle() {
		this.setState({
			shown: !this.state.shown
		});
	}
    
    componentDidMount() {
        /* fetch API in action */
        axios.get('http://127.0.0.1:8000/api/product_categories')
            .then(function (response) {
                return response;
            })
            .then(products => {
                //Fetched product is stored in the state
                this.setState({ products: products.data });
            });
    }

    renderDataSource(product, index) {
        return (
            <li key={product.id} onClick={
                () =>this.handleClick(product)} >
                { product.Name } 
            </li>
        )
    }

    renderData(product, index) {
        return (
            { value: product.ID, label: product.Name }
        )
    }
    renderData2(product, index) {
        return (
            { value: product.ID, label: product.Name }
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
        // product.price = Number(product.price);
        /*Fetch API for post request */
        // fetch( 'http://127.0.0.1:8000/api/products', {
        //     method:'post',
        //     /* headers are important*/
        //     mode: 'no-cors',
        //     headers: {
        //         // 'Access-Control-Allow-Origin': '*',
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json',
        //     //   'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        //     },
            
        //     body: JSON.stringify(product)
        // })
        axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/products',
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
                currentProduct : data
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
        
        const divStyle = {
            justifyContent: "flex-start",
            width: '35%',
            background: '#f0f0f0',
            padding: '20px 20px 20px 20px',
            margin: '30px 10px 10px 30px'
        }

        const { selectedOption } = this.state;
        const { selectedOption2 } = this.state;
        const value = selectedOption && selectedOption.value;
        const value2 = selectedOption2 && selectedOption2.value2;

        return (
            <div>
                <NavbarSection />
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col>
                                <h1>Welcome to React</h1>
                                <p>
                                    <Button
                                        tag="a"
                                        color="success"
                                        size="large"
                                        href="http://reactstrap.github.io"
                                        target="_blank"
                                    >
                                        View Reactstrap Docs
                                    </Button>
                                </p>
                                <Select.Creatable
                                    name="form-field-name"
                                    value={value}
                                    onChange={this.handleChange}
                                    options={ this.state.products.map(this.renderData) }
                                />
                            </Col>
                        </Row>
                    </Container>
                    <Container style={ shown }>
                        <div style={divStyle}>
                            <h3> All products </h3>
                            <ul>
                                { this.state.products.map(this.renderDataSource) }
                                {/* { this.renderProducts() } */}
                            </ul> 
                        </div>
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
            </div>
        );
    }
}

export default App;
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
			openCart: false,
            products: [],
			purchases: [],
			currentFilter: null,
			filterBy: '',
            selectedOption: '',
			selectedOption2: '',
			lastPurchased: 0,
			cartItems: 0,
			visible: 5,
		}

		this.handleClick = this.handleClick.bind(this);
		this.loadMore = this.loadMore.bind(this);
		// this.handleClickToCart = this.handleClickToCart.bind(this);
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
				let val =  purchases.data
					.filter((purchase) => {
						return !purchase['payment_id']
					})
				let cartItems = val.length
				
				this.setState({ purchases: purchases.data });
				this.setState({ cartItems: cartItems });
				this.setState({ lastPurchased: purchases.data.length - cartItems });
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
	}
	
	handleClickToCart = (prevState) => {
		this.setState({ openCart: prevState });
	}

	showLink = (key, val, title) => {
		if (!val) { // evaluates to true if val is null
			return '-'; 
		}
		if (this.state.currentFilter && key===this.state.currentFilter) {
			return !title ? val : title
		}
		return (
			<a href="#" onClick={() => this.handleClick(key, val)}>
				{ !title ? val : title }
			</a>
		)
	}

	formatDateToString = (date) => {
		// 01, 02, 03, ...
		var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
		// 01, 02, 03, ...
		var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
		// 18, 19, 20, ...
		var yy = date.getFullYear().toString().slice(-2);
	 
		// create the format you want
		return (dd + '/' + MM + '/' + yy);
	 }

    renderMainData() {
		return this.state.purchases
			.filter((purchase, by) => {
				if (this.state.openCart) {
					return !purchase['payment_id']
				}
				if (!this.state.currentFilter && purchase['payment_id']) {
					return true;
				}
				return purchase[this.state.currentFilter] === this.state.filterBy && purchase['payment_id']
			})
			.slice(0, this.state.visible)
			.map((purchase, index) => {
				let unit = !purchase.unit ? '' : purchase.unit
				let packSize = !purchase.pack_size ? '-' : purchase.pack_size +' '+ unit
				let myDate = new Date(purchase.date);
				let dateFormat = this.formatDateToString(myDate);
				let price = +purchase.unit_price
				price = price.toFixed().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
				
				return (
					<tr key={ purchase.index } >
						<th scope="row">{index+1}</th>
						<td>{ this.showLink('category', purchase.category) }</td>
						<td>{ this.showLink('name', purchase.name) }</td>
						{/* <td>{ packSize }</td> */}
						<td>{ price }</td>
						<td>{ purchase.qty }</td>
						<td>{ this.showLink('date', purchase.date, dateFormat) }</td>
						<td>{ this.showLink('id', purchase.id, 'See') }</td>
					</tr>
				)
			})
	}
	
	renderDetailData() {
		return this.state.purchases
			.filter((purchase, by) => {
			return purchase[this.state.currentFilter] === this.state.filterBy
			})
			.map((purchase, index) => {
				let unit = !purchase.unit ? '' : purchase.unit
				let packSize = !purchase.pack_size ? '-' : purchase.pack_size +' '+ unit
				let myDate = new Date(purchase.date);
				let dateFormat = this.formatDateToString(myDate);
				let price = +purchase.unit_price
				price = price.toFixed().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
				
				return (
					<ul key={ purchase.index } >
						<li>ID: { purchase.id }</li>
						<li>Category: { purchase.category }</li>
						<li>Name: { purchase.name }</li>
						<li>Pack Size: { packSize+unit }</li>
						<li>Price: { price }</li>
						<li>Qty: { purchase.qty }</li>
						<li>Store: { purchase.store }</li>
						<li>Date: { dateFormat }</li>
						<li>Payment ID: { purchase.payment_id }</li>
						<li>Payment Type: { purchase.payment_type }</li>
						<li>Bank: { purchase.bank }</li>
						<li>Instalment: { purchase.instalment }</li>
					</ul>
				)
			})
	}
	
	showTitle = (val) => {
		val = 'Last Purchased'
		if (this.state.openCart) {
			val = 'Your Cart'
		}
		return (
			<h1>{ val }</h1>
		)
	}

	showAlert = () => {
		return (
			<Alert color="primary">
				<button type="button" className="close" aria-label="Close" onClick={() => this.handleClick()}><span aria-hidden="true">×</span></button>
				<h2 className="alert-heading">{ this.state.currentFilter==='id' ? 'Detail' : 'Filter' } Product</h2>
				by { this.state.currentFilter }: { this.state.filterBy }
				{/* <Button color="primary" size="sm" onClick={() => this.handleClick()}>Clear Filter</Button>{' '} */}
			</Alert>
		)
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
	
	loadMore() {
		this.setState({
		  visible: this.state.visible + 5
		});
	}

    render() {
        var shown = {
			display: this.state.shown ? "block" : "none"
		};
		var hidden = {
			display: this.state.shown ? "none" : "block"
		}
		
		var shownDiv = {
			display: this.state.currentFilter!=='id' ? "block" : "none"
		};
		var hiddenDiv = {
			display: this.state.currentFilter!=='id' ? "none" : "block"
        }

        const { selectedOption } = this.state;
        const { selectedOption2 } = this.state;
        const value = selectedOption && selectedOption.value;
        const value2 = selectedOption2 && selectedOption2.value2;

        return (
            <div>
                <NavbarSection cart={ this.state.cartItems } onClickCart={this.handleClickToCart} />
				<Container>
					{ this.showTitle() }
					<div style={ hidden }>
						{ this.showAlert() }
					</div>
					<Row>
						<Col>
							<div style={ shownDiv }>
								<Table responsive bordered hover size="sm">
									<thead>
									<tr>
										<th>#</th>
										<th>Category</th>
										<th>Name</th>
										{/* <th>Pack Size</th> */}
										<th>Unit Price</th>
										<th>Qty</th>
										<th>Date</th>
										<th>Details</th>
									</tr>
									</thead>
									<tbody>
										{ this.renderMainData() }
									</tbody>
								</Table>
								{this.state.visible < this.state.lastPurchased &&
									<Button color="warning" className="load-more" onClick={this.loadMore}>Load More</Button>}
							</div>
							<div style={ hiddenDiv }>
								<ul>
									{ this.renderDetailData() }
								</ul>
							</div>
						</Col>
					</Row>
				</Container>
            </div>
        );
    }
}

export default App;
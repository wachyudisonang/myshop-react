import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
	NavLink,
	Button,
	Badge
} from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);

		this.toggle = this.toggle.bind(this);
		this.handleClickToCart = this.handleClickToCart.bind(this);
        this.state = {
			isOpen: false,
			openCart: true
        };
	}
	
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
	}
	
	handleClickToCart = () => {
		this.setState({
			openCart: !this.state.openCart
        });
		this.props.onClickCart(this.state.openCart);
	}

    render() {
        return (
            <div>
                <Navbar color="inverse" light expand="md">
                    <NavbarBrand href="/">My Purchase App</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink onClick={ this.handleClickToCart }>Home</NavLink>
                            </NavItem>
                            <Button color="primary" outline onClick={ this.handleClickToCart }>
								Cart <Badge color="secondary">{ this.props.cart }</Badge>
							</Button>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default App;
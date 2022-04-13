import {Component} from "react";
import {Container, Nav, Navbar, NavLink} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem("user")
        }
    }


    render() {
        return <Navbar bg="light" expand="lg" className={'shadow-sm'}>
            <Container>
                <Navbar.Brand href="#home">Tasks Management System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to={'/'} className={'nav-link'} href="#home">Home</Link>
                        {this.state.loggedIn ? <NavLink onClick={(e)=>{
                                e.preventDefault();
                                localStorage.removeItem("user");
                                this.props.history.push('/login');
                            }} to='/login' className={'nav-link'}>Logout</NavLink> :
                            <span/>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>;
    }
}


export default withRouter(NavigationBar);
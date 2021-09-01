import '../navbars.css';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import money from './money.ico';

export default function Top () {
    return (
        <>
        <Navbar id="navigation-bar" collapseOnSelect fixed="left" expand="md">
        <Container fluid id="navbar-container">
            <Navbar.Brand id="name" href="">
            <img src={money} height="30" className="d-inline-block align-top" alt="logo" />
                {/*process.env.REACT_APP_APP_NAME}!*/}
                Wallstreet
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
            <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
                <NavDropdown title="Calculators" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/calculators/black-scholes">Black Scholes Model</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </>
    );
}
import '../navbars.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import money from './money.ico';

export default function Top () {
    return (
        <>
        <Navbar id="navigation-bar" collapseOnSelect fixed="left" expand="md">
        <Container fluid id="navbar-container">
            <Navbar.Brand href="">
            <img src={money} height="30" className="d-inline-block align-top" alt="logo" />
                {/*process.env.REACT_APP_APP_NAME}!*/}
                Wallstreet
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
            <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
                <Nav.Link href="calculator">Calculator</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </>
    );
}
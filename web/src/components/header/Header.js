import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
  // Definir el estado para manejar la visibilidad de los dropdowns
  const [showDropdown, setShowDropdown] = useState(false);

  // Función para mostrar o esconder el dropdown al pasar el ratón
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  return (
    <Navbar expand="lg" bg="light" variant="light" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="#page-top">
          Celine Is Awesome
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="#services">
              Services
            </Nav.Link>
            <NavDropdown
              title="Dropdown"
              id="basic-nav-dropdown"
              show={showDropdown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavDropdown.Item as={Link} to="#action/3.1">
                Action
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#action/3.3">
                Something else
              </NavDropdown.Item>
            </NavDropdown>
            <Button variant="outline-danger" as={Link} to="/logout">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={(navData) => (navData.isActive ? "Active" : "")}
              as={NavLink}
              to="/manutencoes/"
            >
              Manutenções
            </Nav.Link>
            <Nav.Link
              className={(navData) => (navData.isActive ? "Active" : "")}
              as={NavLink}
              to="/clientes/"
            >
              Clientes
            </Nav.Link>
            <Nav.Link
              className={(navData) => (navData.isActive ? "Active" : "")}
              as={NavLink}
              to="/produtos/"
            >
              Produtos
            </Nav.Link>
            <Nav.Link
              className={(navData) => (navData.isActive ? "Active" : "")}
              as={NavLink}
              to="/categorias/"
            >
              Categorias
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown align="end" title="admin" id="basic-nav-dropdown">
              <NavDropdown.Item href="">Perfil</NavDropdown.Item>
              <NavDropdown.Item href="">Configurações</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="">Sair</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
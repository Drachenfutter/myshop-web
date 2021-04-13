import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { CONST } from "../commons/labels";

export default function NavBar(props: any) {
  const logoutUser = () => {
    localStorage.removeItem(CONST.LOCAL_STORAGE_USER_KEY);
  }
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href={CONST.PATH.HOME}>My<strong>Store</strong></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" />
        <Nav>
          <Nav.Link href={CONST.PATH.SIGN_IN} hidden={props.userLogged.name}>Sign In</Nav.Link>
          <Nav.Link href={CONST.PATH.SIGN_UP} hidden={props.userLogged.name}>Sign Up</Nav.Link>
          <Nav.Link href={CONST.PATH.HOME} hidden={!props.userLogged.name}>
            {props.userLogged.name}
          </Nav.Link>
          <Nav.Link href="/" hidden={!props.userLogged.name} onClick={logoutUser} className="text-primary">
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
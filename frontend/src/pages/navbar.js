import React from "react";
import '../css/mainpage.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";

function NavBar() {

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-light" style={{ borderBottom: '1px solid black' }}>
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-center align-items-center" style={{ width: "100%", marginLeft: '70px'}}>
            <NavLink to="/dietRestriction" className="nav-link nav-link-custom" activeClassName="active-nav-link">Diet Restriction</NavLink>
            <NavLink to="/progress" className="nav-link nav-link-custom" activeClassName="active-nav-link">My Progress</NavLink>
            <div className="col-md-6 col-lg-2 col-xl-1">
                <Link to="/mainpage">
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'  , fontSize: '1.5em', color: 'black', maginLeft: '20px'}}>
                  <FiHome />
                  </div>
                </Link>
            </div>
            <NavLink to="/pantry" className="nav-link nav-link-custom" activeClassName="active-nav-link">Pantry</NavLink>
            <NavLink to="/favorite" className="nav-link nav-link-custom" activeClassName="active-nav-link">Favorite</NavLink>
            <NavLink to="/history" className="nav-link nav-link-custom" activeClassName="active-nav-link">History</NavLink>
            <div className="col-md-5 col-lg-1 col-xl-1">
                <Link to="/profile">
                  <div style={{marginLeft: '13px', marginBottom: '5px', fontSize: '1.2em', color: 'black'}}>
                    <IoPersonOutline />
                    </div>
                </Link>
            </div>          
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    Media, DropdownMenu, DropdownItem
} from "reactstrap";

const Navigation = ({ authUser }) =>
  authUser ? (
    <NavigationAuth authUser={authUser} />
  ) : (
    <NavigationNonAuth />
  );

const NavigationAuth = ({ authUser }) => (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
            <Link className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" to={ROUTES.HOME}>MAIN</Link>
            <Nav className="align-items-center d-none d-md-flex" navbar>
                <UncontrolledDropdown nav>
                    <DropdownToggle className="pr-0" nav>
                        <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <i className="ni ni-single-02"></i>
                    </span>
                            <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                          {authUser.username}
                      </span>
                            </Media>
                        </Media>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem className="noti-title" header tag="div">
                            <h6 className="text-overflow m-0">Welcome!</h6>
                        </DropdownItem>
                        <DropdownItem to={ROUTES.ACCOUNT} tag={Link}>
                            <i className="ni ni-single-02" />
                            <span>My profile</span>
                        </DropdownItem>
                        <DropdownItem divider />
                        <SignOutButton />
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Container>
    </Navbar>
);

const NavigationNonAuth = () => (
    <>
        <Navbar
            className="navbar-top navbar-horizontal navbar-dark"
            expand="md"
        >
            <Container className="px-4">
                <NavbarBrand to="/">
                    <img alt="..." src={require("../../assets/img/brand/argon-react-white.png")} />
                </NavbarBrand>
                <button className="navbar-toggler" id="navbar-collapse-main">
                    <span className="navbar-toggler-icon" />
                </button>
                <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
                    <div className="navbar-collapse-header d-md-none">
                        <Row>
                            <Col className="collapse-brand" xs="6">
                                <Link to="/">
                                    <img
                                        alt="..."
                                        src={require("../../assets/img/brand/argon-react.png")}
                                    />
                                </Link>
                            </Col>
                            <Col className="collapse-close" xs="6">
                                <button
                                    className="navbar-toggler"
                                    id="navbar-collapse-main"
                                >
                                    <span />
                                    <span />
                                </button>
                            </Col>
                        </Row>
                    </div>
                    <Nav className="ml-auto" navbar>

                        <NavItem>
                            <NavLink
                                className="nav-link-icon"
                                to={ROUTES.LANDING}
                                tag={Link}
                            >
                                <i className="ni ni-circle-08" />
                                <span className="nav-link-inner--text">Main</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className="nav-link-icon"
                                to={ROUTES.SIGN_IN}
                                tag={Link}
                            >
                                <i className="ni ni-key-25" />
                                <span className="nav-link-inner--text">Login</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </UncontrolledCollapse>
            </Container>
        </Navbar>
    </>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);

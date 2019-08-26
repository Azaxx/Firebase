import React from 'react';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

import { withAuthorization, withEmailVerification } from '../Session';
import {Route, Switch} from "react-router-dom";
import {Card, CardFooter, CardHeader, Container, Pagination, PaginationItem, PaginationLink, Row} from "reactstrap";

import Navigation from '../Navigation';
// core components
// import Header from "../Headers/Header.js";
import HomeHeader from "../Headers/HomeHeader.js";

class HomePage extends React.Component {
    componentDidUpdate(e) {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.mainContent.scrollTop = 0;
    }
    render() {
        const {pathname} = this.props.location;
        return (
            <>
                <div className="main-content" ref="mainContent">
                    <Navigation/>
                    <HomeHeader />
                    {/*{pathname === ROUTES.HOME ? <HomeHeader /> : <Header />}*/}

                    <Container className="mt--7" fluid>
                        <h1>Hi this is private page </h1>
                    </Container>
                </div>
            </>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);

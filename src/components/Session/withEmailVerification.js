import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import Navigation from "../Navigation";
import {Card, CardBody, Col, Container, Row, Button} from "reactstrap";
import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {PasswordForgetForm} from "../PasswordForget";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    componentDidMount() {
      document.body.classList.add("bg-default");
    }
    componentWillUnmount() {
      document.body.classList.remove("bg-default");
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(this.props.authUser) ? (
          <div className="main-content">
            <Navigation />
            <div className="header bg-gradient-info py-7 py-lg-8">
              <Container>
                <div className="header-body text-center mb-7">
                  <Row className="justify-content-center">
                    <Col lg="5" md="6">
                      {this.state.isSent ? (
                          <h1 className="text-white">E-Mail confirmation sent</h1>
                      ):(
                          <h1 className="text-white">Verify your E-Mail</h1>
                      )
                      }

                    </Col>
                  </Row>
                </div>
              </Container>
              {/*<div className="separator separator-bottom separator-skew zindex-100">*/}
              {/*  <svg*/}
              {/*      xmlns="http://www.w3.org/2000/svg"*/}
              {/*      preserveAspectRatio="none"*/}
              {/*      version="1.1"*/}
              {/*      viewBox="0 0 2560 100"*/}
              {/*      x="0"*/}
              {/*      y="0"*/}
              {/*  >*/}
              {/*    <polygon*/}
              {/*        className="fill-default"*/}
              {/*        points="2560 0 2560 100 0 100"*/}
              {/*    />*/}
              {/*  </svg>*/}
              {/*</div>*/}
            </div>
            <Container className="mt--8 pb-5">
              <Row className="justify-content-center">
                <Col lg="5" md="7">
                  <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        {this.state.isSent ? (
                            <small>Check your E-Mails (Spam folder
                              included) for a confirmation E-Mail. Refresh this page
                              once you confirmed your E-Mail.</small>
                        ):(
                            <small>Check your E-Mails (Spam folder
                          included) for a confirmation E-Mail or send another
                              confirmation E-Mail.</small>
                        )}
                      </div>
                      <div className="text-center">
                        <Button
                            type="button"
                            onClick={this.onSendEmailVerification}
                            disabled={this.state.isSent}
                            color="primary"
                        >
                          Send E-Mail
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                  <Row className="mt-3">
                    <Col xs="6">
                      <Link to={ROUTES.SIGN_IN} className="text-light"><small>Sign In</small></Link>
                    </Col>
                    <Col className="text-right" xs="6">
                      <Link to={ROUTES.SIGN_UP} className="text-light"><small>Sign Up</small></Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
        </div>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withFirebase,
    connect(mapStateToProps),
  )(WithEmailVerification);
};

export default withEmailVerification;

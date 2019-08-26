import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import Navigation from '../Navigation';

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col, Container
} from "reactstrap";

class SignUpPage extends React.Component {
    componentDidMount() {
        document.body.classList.add("bg-default");
    }
    componentWillUnmount() {
        document.body.classList.remove("bg-default");
    }
    render() {
        return (
            <>
                <div className="main-content">
                    <Navigation />
                    <div className="header bg-gradient-info py-7 py-lg-8">
                        <Container>
                            <div className="header-body text-center mb-7">
                                <Row className="justify-content-center">
                                    <Col lg="5" md="6">
                                        <h1 className="text-white">Welcome!</h1>
                                        {/*<p className="text-lead text-light">*/}
                                        {/*  Use these awesome forms to login or create new account in*/}
                                        {/*  your project for free.*/}
                                        {/*</p>*/}
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                        <div className="separator separator-bottom separator-skew zindex-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="fill-default"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </div>
                    {/* Page content */}
                    <Container className="mt--8 pb-5">
                        <Row className="justify-content-center">
                            <Col lg="6" md="8">
                                <Card className="bg-secondary shadow border-0">
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <h3>Sign Up</h3>
                                        </div>
                                            <SignUpForm />
                                    </CardBody>
                                </Card>
                                <Row className="mt-3">
                                    <Col xs="6">
                                        <Link to={ROUTES.PASSWORD_FORGET} className="text-light"><small>Forgot password?</small></Link>
                                    </Col>
                                    <Col className="text-right" xs="6">
                                        <Link to={ROUTES.SIGN_IN} className="text-light"><small>Sign In</small></Link>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}


const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
        <Form role="form" onSubmit={this.onSubmit}>
            <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-hat-3" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name="username"
                           value={username}
                           onChange={this.onChange}
                           type="text"
                           placeholder="Full Name"/>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input name="email"
                           value={email}
                           onChange={this.onChange}
                           type="email"
                           placeholder="Email Address" />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input name="passwordOne"
                           value={passwordOne}
                           onChange={this.onChange}
                           type="password"
                           placeholder="Password" />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input name="passwordTwo"
                           value={passwordTwo}
                           onChange={this.onChange}
                           type="password"
                           placeholder="Confirm Password" />
                </InputGroup>
            </FormGroup>
            <div className="text-muted font-italic">
                <small>
                    {/*password strength:{" "}*/}
                    {/*<span className="text-success font-weight-700">strong</span>*/}
                    {error && <p>{error.message}</p>}
                </small>
            </div>
            {/*<Row className="my-4">*/}
            {/*    <Col xs="12">*/}
            {/*        <div className="custom-control custom-control-alternative custom-checkbox">*/}
            {/*            <input*/}
            {/*                className="custom-control-input"*/}
            {/*                id="customCheckRegister"*/}
            {/*                type="checkbox"*/}
            {/*            />*/}
            {/*            <label*/}
            {/*                className="custom-control-label"*/}
            {/*                htmlFor="customCheckRegister"*/}
            {/*            >*/}
            {/*            <span className="text-muted">*/}
            {/*              I agree with the{" "}*/}
            {/*                <a href="#pablo" onClick={e => e.preventDefault()}>*/}
            {/*                Privacy Policy*/}
            {/*              </a>*/}
            {/*            </span>*/}
            {/*            </label>*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <div className="text-center">
                <Button className="mt-4" color="primary" disabled={isInvalid} type="submit">
                    Create account
                </Button>
            </div>
        </Form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };

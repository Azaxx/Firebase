import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {
  Button,
  Card,
  Container,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

import Navigation from '../Navigation';

class SignInPage extends React.Component {
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
                <Col lg="5" md="7">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                      <div className="text-muted text-center mt-2 mb-3">
                        <small>Sign in with</small>
                      </div>
                      <div className="btn-wrapper text-center">
                        <SignInGoogle />
                        <SignInFacebook />
                        <SignInTwitter />
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>Or sign in with credentials</small>
                      </div>
                      <SignInForm />
                    </CardBody>
                  </Card>
                  <Row className="mt-3">
                    <Col xs="6">
                      <Link to={ROUTES.PASSWORD_FORGET} className="text-light"><small>Forgot password?</small></Link>
                    </Col>
                    <Col className="text-right" xs="6">
                      <Link to={ROUTES.SIGN_UP} className="text-light"><small>Sign Up</small></Link>
                    </Col>
                  </Row>
                  {/*<PasswordForgetLink />*/}
                  {/*<SignUpLink />*/}
                </Col>

              </Row>
            </Container>
          </div>
        </>
    );
  }
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
        <Form onSubmit={this.onSubmit}>
          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input name="email"
                     value={email}
                     onChange={this.onChange}
                     type="text"
                     placeholder="Email Address"/>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon>
              <Input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password"/>
            </InputGroup>
          </FormGroup>
          {error && <p>{error.message}</p>}
          <div className="text-center">
            <Button className="my-4" color="primary" disabled={isInvalid} type="submit">
              Login
            </Button>
          </div>
        </Form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <>
        <Button
            className="btn-neutral btn-icon"
            color="default"
            onClick={this.onSubmit}
        >
          <span className="btn-inner--icon">
            <img alt="..." src={require("../../assets/img/icons/google.svg")}/>
          </span>
        </Button>

        {error && <p>{error.message}</p>}
      </>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
        <>
          <Button
              className="btn-neutral btn-icon"
              color="default"
              onClick={this.onSubmit}
          >
          <span className="btn-inner--icon">
            <img alt="..." src={require("../../assets/img/icons/facebook.svg")}/>
          </span>
          </Button>

          {error && <p>{error.message}</p>}
        </>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
        <>
          <Button
              className="btn-neutral btn-icon"
              color="default"
              onClick={this.onSubmit}
          >
          <span className="btn-inner--icon">
            <img alt="..." src={require("../../assets/img/icons/twitter.svg")}/>
          </span>
          </Button>

          {error && <p>{error.message}</p>}
        </>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };

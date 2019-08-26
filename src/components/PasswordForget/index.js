import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

class PasswordForgetPage extends React.Component {
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
                                <h1 className="text-white">Forgot your password?</h1>
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
            <Container className="mt--8 pb-5">
                <Row className="justify-content-center">
                    <Col lg="5" md="7">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-center text-muted mb-4">
                                    <small>We will send password reset link to that email</small>
                                </div>
                                <PasswordForgetForm />
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
            </>
        );
    }
}

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
        <>
        <Form role="form" onSubmit={this.onSubmit}>
            <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" name="email" type="email" value={this.state.email} onChange={this.onChange}/>
                </InputGroup>
            </FormGroup>
            {error && <p>{error.lead}</p>}
            <div className="text-center">
                <Button className="my-4" color="primary" disabled={isInvalid} type="submit">
                    Reset My Password
                </Button>
            </div>
        </Form>
        </>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };

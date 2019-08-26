import React from 'react';

import { withFirebase } from '../Firebase';
import {DropdownItem} from "reactstrap";


const SignOutButton = ({ firebase }) => (
    <DropdownItem onClick={firebase.doSignOut}>
        <i className="ni ni-user-run" />
        <span>Sign Out</span>
    </DropdownItem>
);

export default withFirebase(SignOutButton);

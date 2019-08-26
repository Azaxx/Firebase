import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

class HomeHeader extends React.Component {
    render() {
        return (
            <>
                <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                    <Container fluid>
                        <div className="header-body">
                            {/* Card stats */}
                            <h1 className="display-2 text-white"> Hello World</h1>
                        </div>
                    </Container>
                </div>
            </>
        );
    }
}

export default HomeHeader;

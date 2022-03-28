import React from 'react';
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="d-flex justify-content-even align-items-center w-100">
            <Button
                variant='outlined'
                className="menuBtn greyShadow me-2"
                component={Link}
                to="/"
                color="primary"
            >
                Deliveries
            </Button>

            <div className="separator mx-2"></div>

            <Button
                variant='outlined'
                className="menuBtn greyShadow ms-2"
                component={Link}
                to="/bots"
                color="primary"
                style={{width: "111px"}}
            >
                Bots
            </Button>
        </div>
    );
}

export default Menu;
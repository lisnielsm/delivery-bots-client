import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useNavigate } from "react-router-dom";

import { createNewBotAction, getBotsAction } from '../actions/botsActions';
import { Button } from '@material-ui/core';

const EditBot = () => {
    const [code, setCode] = useState("");
    const [dropofflatitude, setDropoffLatitude] = useState("");
    const [dropofflongitude, setDropoffLongitude] = useState("");
    const [zoneid, setZoneId] = useState("");

    const navigate = useNavigate();

    // get the state
    const error = useSelector(state => state.bots.error);
    const loading = useSelector(state => state.bots.loading);

    const dispatch = useDispatch();

    const addBot = bot => dispatch(createNewBotAction(bot));

    const submitNewBot = e => {
        e.preventDefault();

        // create new bot
        addBot({
            code: code,
            status: "available",
            location: {
                dropoff_lat: Number(dropofflatitude),
                dropoff_lon: Number(dropofflongitude),
            },
            zone_id: zoneid
        });

        dispatch(getBotsAction());

        // redirect
        return navigate("/bots");
    }

    return (
        <div className="row justify-content-center my-5">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-center mb-4 font-weight-bold" style={{ color: "#3f51b5" }}>
                            Add new bot
                        </h2>

                        <ValidatorForm
                            autoComplete="off"
                            onSubmit={submitNewBot}
                            onError={errors => console.debug(errors)}
                            noValidate={true}
                        >
                            <div className="login-form mt1 col-xs-12">
                                <div className="text-center">
                                    <TextValidator
                                        name="code"
                                        placeholder="Code"
                                        label="Code"
                                        variant="outlined"
                                        margin="normal"
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required']}
                                        errorMessages={["Code is required"]}
                                        className="mb2"
                                    />
                                </div>

                                <div className="text-center">
                                    <TextValidator
                                        name="dropofflatitude"
                                        placeholder="Dropoff latitude"
                                        label="Dropoff latitude"
                                        variant="outlined"
                                        margin="normal"
                                        value={dropofflatitude}
                                        onChange={e => setDropoffLatitude(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required', "matchRegexp:^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$"]}
                                        errorMessages={["Pickup latitude is required", "Please enter a correct latitude"]}
                                        className="mb2"
                                    />
                                </div>

                                <div className="text-center">
                                    <TextValidator
                                        name="dropofflongitude"
                                        placeholder="Dropoff longitude"
                                        label="Dropoff longitude"
                                        variant="outlined"
                                        margin="normal"
                                        value={dropofflongitude}
                                        onChange={e => setDropoffLongitude(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required', "matchRegexp:^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$"]}
                                        errorMessages={["Pickup longitude is required", "Please enter a correct longitude"]}
                                        className="mb2"
                                    />
                                </div>

                                <div className="text-center">
                                    <TextValidator
                                        name="zoneid"
                                        placeholder="Zone ID"
                                        label="Zone ID"
                                        variant="outlined"
                                        margin="normal"
                                        value={zoneid}
                                        onChange={e => setZoneId(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required']}
                                        errorMessages={["Zone ID is required"]}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="mt-4 w-100"
                                    size="large"
                                    color="primary"
                                >
                                    Create
                                </Button>

                            </div>

                        </ValidatorForm>

                        {loading ? <p>Loading...</p> : null}
                        {error ? <p className="alert alert-danger p2 mt-4 text-center">There was an error</p> : null}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBot;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useNavigate } from "react-router-dom";

import { createNewDeliveryAction, getDeliveriesAction } from '../actions/deliveryActions';
import { Button } from '@material-ui/core';

const EditDelivery = () => {
    const [pickuplatitude, setPickupLatitude] = useState("");
    const [pickuplongitude, setPickupLongitude] = useState("");
    const [dropofflatitude, setDropoffLatitude] = useState("");
    const [dropofflongitude, setDropoffLongitude] = useState("");
    const [zoneid, setZoneId] = useState("");

    const navigate = useNavigate();

    // get the state
    const error = useSelector(state => state.deliveries.error);
    const loading = useSelector(state => state.deliveries.loading);

    const dispatch = useDispatch();

    const addDelivery = delivery => dispatch(createNewDeliveryAction(delivery));

    const submitNewDelivery = e => {
        e.preventDefault();

        // create new delivery
        addDelivery({
            id: 1,
            state: "pending",
            creation_date: Date.now(),
            pickup: {
                pickup_lat: Number(pickuplatitude),
                pickup_lon: Number(pickuplongitude),
            },
            dropoff: {
                dropoff_lat: Number(dropofflatitude),
                dropoff_lon: Number(dropofflongitude),
            },
            zone_id: zoneid
        });

        dispatch(getDeliveriesAction());

        // redirect
        return navigate("/");
    }

    const handleBackClick = () => {
        // redirect
        return navigate("/");
    }

    return (
        <div className="row justify-content-center my-5">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-center mb-4 font-weight-bold" style={{ color: "#3f51b5" }}>
                            Add new delivery
                        </h2>

                        <ValidatorForm
                            autoComplete="off"
                            onSubmit={submitNewDelivery}
                            onError={errors => console.debug(errors)}
                            noValidate={true}
                        >
                            <div className="login-form mt1 col-xs-12">
                                <div className="text-center">
                                    <TextValidator
                                        name="pickuplatitude"
                                        placeholder="Pickup latitude"
                                        label="Pickup latitude"
                                        variant="outlined"
                                        margin="normal"
                                        value={pickuplatitude}
                                        onChange={e => setPickupLatitude(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required', "matchRegexp:^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$"]}
                                        errorMessages={["Pickup latitude is required", "Please enter a correct latitude"]}
                                        className="mb2"
                                    />
                                </div>

                                <div className="text-center">
                                    <TextValidator
                                        name="pickuplongitude"
                                        placeholder="Pickup longitude"
                                        label="Pickup longitude"
                                        variant="outlined"
                                        margin="normal"
                                        value={pickuplongitude}
                                        onChange={e => setPickupLongitude(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required', "matchRegexp:^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$"]}
                                        errorMessages={["Pickup longitude is required", "Please enter a correct longitude"]}
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

                                <div className="d-flex flex-column flex-sm-row w-100">
                                    <Button
                                        variant="contained"
                                        className="mt-4 me-2 w-100"
                                        size="large"
                                        color="default"
                                        onClick={handleBackClick}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="mt-4 ms-2 w-100"
                                        size="large"
                                        color="primary"
                                    >
                                        Create
                                    </Button>
                                </div>

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

export default EditDelivery;
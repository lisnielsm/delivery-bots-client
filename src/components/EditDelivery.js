import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useNavigate } from "react-router-dom";
import { Button } from '@material-ui/core';

import { editDeliveryAction } from '../actions/deliveryActions';

const EditDelivery = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState({
        id: "",
        state: "",
        creation_date: "",
        pickup: {
            pickup_lat: "",
            pickup_lon: "",
        },
        dropoff: {
            dropoff_lat: "",
            dropoff_lon: "",
        },
        zone_id: ""
    });

    // delivery to edit
    const editdelivery = useSelector(state => state.deliveries.editdelivery);

    // fill the state automatically
    useEffect(() => {
        setDelivery({
            id: editdelivery.id,
            state: editdelivery.state,
            creation_date: editdelivery.creation_date,
            pickup: {
                pickup_lat: editdelivery.pickup.pickup_lat.toString(),
                pickup_lon: editdelivery.pickup.pickup_lon.toString(),
            },
            dropoff: {
                dropoff_lat: editdelivery.dropoff.dropoff_lat.toString(),
                dropoff_lon: editdelivery.dropoff.dropoff_lon.toString(),
            },
            zone_id: editdelivery.zone_id
        });
    }, [editdelivery])

    // Read the form data
    const onChangeForm = e => {
        setDelivery({
            ...delivery,
            [e.target.name]: e.target.value
        })
    }

    const submitEditDelivery = e => {
        e.preventDefault();

        dispatch(editDeliveryAction(delivery));

        // redirect
        return navigate("/");
    }

    return ( 
        <div className="row justify-content-center my-5">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-center mb-4 font-weight-bold" style={{ color: "#3f51b5" }}>
                            Edit delivery
                        </h2>

                        <ValidatorForm
                            autoComplete="off"
                            onSubmit={submitEditDelivery}
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
                                        value={delivery ? delivery.pickup.pickup_lat : ""}
                                        onChange={onChangeForm}
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
                                        value={delivery ? delivery.pickup.pickup_lon : ""}
                                        onChange={onChangeForm}
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
                                        value={delivery ? delivery.dropoff.dropoff_lat : ""}
                                        onChange={onChangeForm}
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
                                        value={delivery ? delivery.dropoff.dropoff_lon : ""}
                                        onChange={onChangeForm}
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
                                        value={delivery ? delivery.zone_id : ""}
                                        onChange={onChangeForm}
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
                                    Edit
                                </Button>

                            </div>

                        </ValidatorForm>

                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default EditDelivery;
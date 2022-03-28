import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useNavigate } from "react-router-dom";
import { Button } from '@material-ui/core';

import { editBotAction } from '../actions/botsActions';

const EditBot = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [bot, setBot] = useState({
        id: "",
        code: "",
        status: "",
        location: {
            dropoff_lat: "",
            dropoff_lon: "",
        },
        zone_id: ""
    });

    // bot to edit
    const editbot = useSelector(state => state.bots.editbot);

    // fill the state automatically
    useEffect(() => {
        setBot({
            id: editbot.id,
            code: editbot.code,
            status: editbot.status,
            location: {
                dropoff_lat: editbot.location.dropoff_lat.toString(),
                dropoff_lon: editbot.location.dropoff_lon.toString(),
            },
            zone_id: editbot.zone_id
        });
    }, [editbot])

    // Read the form data
    const onChangeForm = e => {
        setBot({
            ...bot,
            [e.target.name]: e.target.value
        })
    }

    const submitEditBot = e => {
        e.preventDefault();

        dispatch(editBotAction(bot));

        // redirect
        return navigate("/bots");
    }

    return ( 
        <div className="row justify-content-center my-5">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-center mb-4 font-weight-bold" style={{ color: "#3f51b5" }}>
                            Edit bot
                        </h2>

                        <ValidatorForm
                            autoComplete="off"
                            onSubmit={submitEditBot}
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
                                        value={bot ? bot.code : ""}
                                        onChange={onChangeForm}
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
                                        value={bot ? bot.location.dropoff_lat : ""}
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
                                        value={bot ? bot.location.dropoff_lon : ""}
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
                                        value={bot ? bot.zone_id : ""}
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
 
export default EditBot;
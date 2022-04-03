import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useNavigate } from "react-router-dom";

import { createNewBotAction, getBotsAction } from '../actions/botsActions';
import { Button } from '@material-ui/core';

const EditBot = () => {
    const [code, setCode] = useState("");

    const navigate = useNavigate();

    // get the state
    const error = useSelector(state => state.bots.error);
    const loading = useSelector(state => state.bots.loading);

    const dispatch = useDispatch();

    const addBot = bot => dispatch(createNewBotAction(bot));

    const submitNewBot = e => {
        e.preventDefault();

        // create new bot
        addBot({ code: code });

        dispatch(getBotsAction());

        // redirect
        return navigate("/bots");
    }

    const handleBackClick = () => {
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
                                        autoFocus
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        fullWidth
                                        required={true}
                                        validators={['required']}
                                        errorMessages={["Code is required"]}
                                        className="mb2"
                                    />
                                </div>

                                <div className="d-flex flex-column flex-sm-row w-100">
                                    <Button
                                        variant="contained"
                                        className="mt-4 me-0 me-sm-2 w-100"
                                        size="large"
                                        color="default"
                                        onClick={handleBackClick}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="mt-4 ms-0 ms-sm-2 w-100"
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

export default EditBot;
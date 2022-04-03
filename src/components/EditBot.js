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
        code: ""
    });

    // bot to edit
    const editbot = useSelector(state => state.bots.editbot);

    // fill the state automatically
    useEffect(() => {
        setBot({
            id: editbot.id,
            code: editbot.code
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
                                        Edit
                                    </Button>
                                </div>

                            </div>

                        </ValidatorForm>

                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default EditBot;
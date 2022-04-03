import {
    CREATE_BOT,
    CREATE_BOT_SUCCESS,
    CREATE_BOT_FAIL,
    START_BOTS_DOWNLOAD,
    DOWNLOAD_BOTS_SUCCESS,
    DOWNLOAD_BOTS_FAIL,
    GET_DELETE_BOT,
    DELETE_BOT_SUCCESS,
    DELETE_BOT_FAIL,
    GET_EDIT_BOT,
    START_BOT_EDITING,
    EDIT_BOT_SUCCESS,
    EDIT_BOT_FAIL,
    START_BOT_ASSIGNING,
    GET_ASSIGN_BOT,
    ASSIGN_BOT_SUCCESS,
    ASSIGN_BOT_FAIL,
} from "../types";

import clientAxios from "../config/axios";
import Swal from 'sweetalert2';

// create new bot
export function createNewBotAction(bot) {
    return async (dispatch) => {
        dispatch(createBot());

        try {
            // insert into the API
            const response = await clientAxios.post('/bots', bot);

            // if all goes well update the state
            dispatch(createBotSuccess(response.data));

            // Alert 
            Swal.fire(
                'Correct',
                'The bot was added correctly',
                'success'
            );
        } catch (error) {
            console.log(error.response);

            // if there is an error change the state
            dispatch(createBotFail(true));

            // alerta de error
            Swal.fire({
                icon: 'error',
                title: 'There was an error',
                text: 'There was an error, please try again'
            });
        }
    }
}

const createBot = () => ({
    type: CREATE_BOT,
    payload: true
})

// if the bot is saved in the database
const createBotSuccess = bot => ({
    type: CREATE_BOT_SUCCESS,
    payload: bot
})

// if there was an error
const createBotFail = state => ({
    type: CREATE_BOT_FAIL,
    payload: state
})

// Function that downloads bots from the database
export function getBotsAction() {
    return async (dispatch) => {
        dispatch( downloadBots() );

        try {
            const response = await clientAxios.get("/bots");
            dispatch(downloadBotsSuccess(response.data));
        } catch (error) {
            console.log(error.response);
            dispatch(downloadBotsFail());
        }

    }
}

const downloadBots = () => ({
    type: START_BOTS_DOWNLOAD,
    payload: true
}); 

const downloadBotsSuccess = bots => ({
    type: DOWNLOAD_BOTS_SUCCESS,
    payload: bots
});

const downloadBotsFail = () => ({
    type: DOWNLOAD_BOTS_FAIL,
    payload: true
});


// Select and delete the bot
export function deleteBotAction(id) {
    return async (dispatch) => {
        dispatch(getDeleteBot(id));

        try {
            await clientAxios.delete(`/bots/${id}`);
            dispatch(deleteBotSuccess());

            // Si se elimina, mostrar la alerta
            Swal.fire(
                'Deleted',
                'The bot was deleted successfully',
                'success'
            );

        } catch (error) {
            console.log(error.response);
            dispatch(deleteBotFail());
        }
    }
};

const getDeleteBot = id => ({
    type: GET_DELETE_BOT,
    payload: id
});

const deleteBotSuccess = () => ({
    type: DELETE_BOT_SUCCESS
});

const deleteBotFail = () => ({
    type: DELETE_BOT_FAIL,
    payload: true
});

// get editing bot
export function getEditBotAction(bot) {
    return (dispatch) => {
        dispatch(getEditBot(bot) );
    }
}

const getEditBot = bot => ({
    type: GET_EDIT_BOT,
    payload: bot
});

// edit a bot in the API and state
export function editBotAction(bot) {
    return async (dispatch) => {
        dispatch(editBot());

        try {
            const response = await clientAxios.patch(`/bots/${bot.id}`, bot);
            dispatch(editBotSuccess(response.data));
            
        } catch (error) {
            console.log(error);
            dispatch(editBotFail());
        }
    }
}

const editBot = () => ({
    type: START_BOT_EDITING
})

const editBotSuccess = bot => ({
    type: EDIT_BOT_SUCCESS,
    payload: bot
})

const editBotFail = () => ({
    type: EDIT_BOT_FAIL,
    payload: true
})

export function changeBotStatusAction(bot, currentStatus, nextStatus) {
    return async (dispatch) => {
        if(currentStatus === "Available") {
            Swal.fire(
                'The bot is in Available status',
                'You need to assign a delivery to pass it to Busy status',
                'warning'
            );
        } else {
            Swal.fire({
                title: 'Are you sure?',
                html: `Are you going to change this bot from status <b>${currentStatus}</b> to status <b>${nextStatus}</b>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3f51b5',
                cancelButtonColor: 'var(--bs-red)',
            }).then((result) => {
                if (result.isConfirmed) {
                    async function changeBotStatus(dispatch) {
                        dispatch(editBot());
    
                        try {
                            const response = await clientAxios.patch(`/bots/${bot.id}`, bot);
                            dispatch(editBotSuccess(response.data));
                        } catch (error) {
                            console.log(error);
                            dispatch(editBotFail());
                        }
                    }
    
                    changeBotStatus(dispatch);
                }
            })
        }
    }
}

// get assigning bot
export function getAssignBotAction(bot) {
    return (dispatch) => {
        dispatch(getAssignBot(bot));
    }
}

const getAssignBot = bot => ({
    type: GET_ASSIGN_BOT,
    payload: bot
});

export function assignBotAction(bot) {
    return async (dispatch) => {
        dispatch(startAssignBot());

        try {
            const response = await clientAxios.post(`/bots/assign/${bot.id}`, bot);
            dispatch(assignBotSuccess(response.data));

            // Alert 
            Swal.fire(
                'Correct',
                'The delivery was assigned correctly',
                'success'
            );

        } catch (error) {
            console.log(error);
            dispatch(assignBotFail());
        }
    }
}

const startAssignBot = () => ({
    type: START_BOT_ASSIGNING
})

const assignBotSuccess = bot => ({
    type: ASSIGN_BOT_SUCCESS,
    payload: bot
})

const assignBotFail = () => ({
    type: ASSIGN_BOT_FAIL,
    payload: true
})

import {
    CREATE_DELIVERY,
    CREATE_DELIVERY_SUCCESS,
    CREATE_DELIVERY_FAIL,
    START_DELIVERIES_DOWNLOAD,
    DOWNLOAD_DELIVERIES_SUCCESS,
    DOWNLOAD_DELIVERIES_FAIL,
    GET_DELETE_DELIVERY,
    DELETE_DELIVERY_SUCCESS,
    DELETE_DELIVERY_FAIL,
    GET_EDIT_DELIVERY,
    START_DELIVERY_EDITING,
    EDIT_DELIVERY_SUCCESS,
    EDIT_DELIVERY_FAIL
} from "../types";

import clientAxios from "../config/axios";
import Swal from 'sweetalert2';

// create new delivery
export function createNewDeliveryAction(delivery) {
    return async (dispatch) => {
        dispatch(createDelivery());

        try {
            // insert into the API
            await clientAxios.post('/deliveries', delivery);

            // if all goes well update the state
            dispatch(createDeliverySuccess(delivery));

            // Alert 
            Swal.fire(
                'Correct',
                'The delivery was added correctly',
                'success'
            );
        } catch (error) {
            console.log(error.response);

            // if there is an error change the state
            dispatch(createDeliveryFail(true));

            // alerta de error
            Swal.fire({
                icon: 'error',
                title: 'There was an error',
                text: 'There was an error, please try again'
            });
        }
    }
}

const createDelivery = () => ({
    type: CREATE_DELIVERY,
    payload: true
})

// if the delivery is saved in the database
const createDeliverySuccess = delivery => ({
    type: CREATE_DELIVERY_SUCCESS,
    payload: delivery
})

// if there was an error
const createDeliveryFail = state => ({
    type: CREATE_DELIVERY_FAIL,
    payload: state
})

// Function that downloads deliveries from the database
export function getDeliveriesAction() {
    return async (dispatch) => {
        dispatch( downloadDeliveries() );

        try {
            const response = await clientAxios.get("/deliveries");
            dispatch(downloadDeliveriesSuccess(response.data));
        } catch (error) {
            console.log(error.response);
            dispatch(downloadDeliveriesFail());
        }

    }
}

const downloadDeliveries = () => ({
    type: START_DELIVERIES_DOWNLOAD,
    payload: true
}); 

const downloadDeliveriesSuccess = deliveries => ({
    type: DOWNLOAD_DELIVERIES_SUCCESS,
    payload: deliveries
});

const downloadDeliveriesFail = () => ({
    type: DOWNLOAD_DELIVERIES_FAIL,
    payload: true
});


// Select and delete the delivery
export function deleteDeliveryAction(id) {
    return async (dispatch) => {
        dispatch(getDeleteDelivery(id));

        try {
            await clientAxios.delete(`/deliveries/${id}`);
            dispatch(deleteDeliverySuccess());

            // Si se elimina, mostrar la alerta
            Swal.fire(
                'Deleted',
                'The delivery was deleted successfully',
                'success'
            );

        } catch (error) {
            console.log(error.response);
            dispatch(deleteDeliveryFail());
        }
    }
};

const getDeleteDelivery = id => ({
    type: GET_DELETE_DELIVERY,
    payload: id
});

const deleteDeliverySuccess = () => ({
    type: DELETE_DELIVERY_SUCCESS
});

const deleteDeliveryFail = () => ({
    type: DELETE_DELIVERY_FAIL,
    payload: true
});

// get editing delivery
export function getEditDeliveryAction(delivery) {
    return (dispatch) => {
        dispatch(getEditDelivery(delivery) );
    }
}

const getEditDelivery = delivery => ({
    type: GET_EDIT_DELIVERY,
    payload: delivery
});

// edit a delivery in the API and state
export function editDeliveryAction(delivery) {
    return async (dispatch) => {
        dispatch(editDelivery());

        try {
            const response = await clientAxios.patch(`/deliveries/${delivery.id}`, delivery);
            dispatch(editDeliverySuccess(response.data));
            
        } catch (error) {
            console.log(error);
            dispatch(editDeliveryFail());
        }
    }
}

const editDelivery = () => ({
    type: START_DELIVERY_EDITING
})

const editDeliverySuccess = delivery => ({
    type: EDIT_DELIVERY_SUCCESS,
    payload: delivery
})

const editDeliveryFail = () => ({
    type: EDIT_DELIVERY_FAIL,
    payload: true
})

export function changeDeliveryStateAction(delivery, currentState, nextState) {  
    return async (dispatch) => {
        Swal.fire({
            title: 'Are you sure?',
            html: `Are you going to change this delivery from state <b>${currentState}</b> to state <b>${nextState}</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: 'var(--bs-red)',
        }).then((result) => {
            if (result.isConfirmed) {
                async function changeDeliveryState(dispatch) {
                    dispatch(editDelivery());

                    try {
                        const response = await clientAxios.patch(`/deliveries/${delivery.id}`, delivery);
                        dispatch(editDeliverySuccess(response.data));
                    } catch (error) {
                        console.log(error);
                        dispatch(editDeliveryFail());
                    }
                }

                changeDeliveryState(dispatch);
            }
        })
    }
}

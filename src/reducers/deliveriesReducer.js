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
    EDIT_DELIVERY_SUCCESS,
    EDIT_DELIVERY_FAIL
} from "../types";


const initialState = {
    deliveries: [],
    error: null,
    loading: false,
    deletedelivery: null,
    editdelivery: null
}

export default function deliveryReducer(state = initialState, action) {
    switch (action.type) {

        case START_DELIVERIES_DOWNLOAD:
        case CREATE_DELIVERY:
            return {
                ...state,
                loading: action.payload
            }
        case CREATE_DELIVERY_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveries: [...state.deliveries, action.payload],
                error: false
            }
        case CREATE_DELIVERY_FAIL:
        case DOWNLOAD_DELIVERIES_FAIL:
        case DELETE_DELIVERY_FAIL:
        case EDIT_DELIVERY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DOWNLOAD_DELIVERIES_SUCCESS:
            return {
                ...state,
                deliveries: action.payload,
                error: null,
                loading: false
            }
        case GET_DELETE_DELIVERY:
            return {
                ...state,
                deletedelivery: action.payload
            }
        case DELETE_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveries: state.deliveries.filter(delivery => delivery.id !== state.deletedelivery),
                deletedelivery: null
            }
        case GET_EDIT_DELIVERY:
            return {
                ...state,
                editdelivery: action.payload
            }
        case EDIT_DELIVERY_SUCCESS:
            return {
                ...state,
                editdelivery: null,
                deliveries: state.deliveries.map(delivery => delivery.id === action.payload.id ? delivery = action.payload : delivery)
            }

        default:
            return state;
    }
}
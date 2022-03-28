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
    EDIT_BOT_SUCCESS,
    EDIT_BOT_FAIL
} from "../types";


const initialState = {
    bots: [],
    error: null,
    loading: false,
    deletebot: null,
    editbot: null
}

export default function botReducer(state = initialState, action) {
    switch (action.type) {

        case START_BOTS_DOWNLOAD:
        case CREATE_BOT:
            return {
                ...state,
                loading: action.payload
            }
        case CREATE_BOT_SUCCESS:
            return {
                ...state,
                loading: false,
                bots: [...state.bots, action.payload],
                error: false
            }
        case CREATE_BOT_FAIL:
        case DOWNLOAD_BOTS_FAIL:
        case DELETE_BOT_FAIL:
        case EDIT_BOT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DOWNLOAD_BOTS_SUCCESS:
            return {
                ...state,
                bots: action.payload,
                error: null,
                loading: false
            }
        case GET_DELETE_BOT:
            return {
                ...state,
                deletebot: action.payload
            }
        case DELETE_BOT_SUCCESS:
            return {
                ...state,
                bots: state.bots.filter(bot => bot.id !== state.deletebot),
                deletebot: null
            }
        case GET_EDIT_BOT:
            return {
                ...state,
                editbot: action.payload
            }
        case EDIT_BOT_SUCCESS:
            return {
                ...state,
                editbot: null,
                bots: state.bots.map(bot => bot.id === action.payload.id ? bot = action.payload : bot)
            }

        default:
            return state;
    }
}
import { combineReducers } from 'redux';
import deliveriesReducer from './deliveriesReducer';
import botsReducer from './botsReducer';

export default combineReducers({
    deliveries: deliveriesReducer,
    bots: botsReducer
});
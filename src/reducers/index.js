import { combineReducers } from 'redux';
import deliveriesReducer from './deliveriesReducer';
import botsReducer from './botsReducer';
import alertaReducer from './alertReducer';

export default combineReducers({
    deliveries: deliveriesReducer,
    bots: botsReducer,
    alerta: alertaReducer
});
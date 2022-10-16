import { combineReducers } from 'redux';
import { User_Reducer } from "./profile/user";
import { Profile_Reducer } from "./profile/profile"
// import customizationReducer from 'src/store/customizationReducer';
import {DESTROY_SESSION} from '../actionTypes/global.Types'
const appReducer = combineReducers({
    User:User_Reducer,
    profile:Profile_Reducer

});
const rootReducer = (state, action) => {
    if(action.type === DESTROY_SESSION)
        state = undefined;

    return appReducer(state, action);
};
export default rootReducer;
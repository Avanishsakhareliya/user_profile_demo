import {
    LIST_PROFILE ,
    ADD_PROFILE,
    GET_PROFILE,
    UPDATE_PROFILE,
    DELETE_PROFILE ,
} from '../../actionTypes/profile.Types';

const initialState = {
    items: [],
    total: 0,
    actionCalled: false,
    createSuccess: false,
    getItemsSuccess: false,
    editSuccess: false,
    successMessage: null,
    errorMessage: null,
};

export const Profile_Reducer= (state = initialState, action)=> {
    const { type, payload } = action;
    switch (type) {
        case LIST_PROFILE:
            return {
                ...state,
                ...payload
            }
        case ADD_PROFILE:
            return {
                ...state,
                actionCalled: true,
                createSuccess: true,
                successMessage: !payload.success ? payload.message : null,
            }
        case GET_PROFILE:
            return {
                ...state,
                items: payload,
                actionCalled: true,
                getItemsSuccess:true
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                actionCalled: true,
                editSuccess: payload.success,
                successMessage: payload.success ? payload.message : null,
                errorMessage: !payload.success ? payload.message : null,
            }
        default:
            return state;
    }
}
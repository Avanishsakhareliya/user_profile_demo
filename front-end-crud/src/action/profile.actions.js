import axios from 'axios';
import {
    LIST_PROFILE ,
    ADD_PROFILE,
    GET_PROFILE,
    UPDATE_PROFILE,
    DELETE_PROFILE ,
} from '../actionTypes/profile.Types';
import { toast } from 'react-toastify';

export const ProfileAdd = (data) => {
    const tokens = localStorage.getItem("token")
    const token = JSON.parse(tokens)

    return async(dispatch) => {
        const response = await axios({
            method: 'POST',
            url: `http://localhost:9090/api/v1/create`,
            headers: { "token": `${token}` },
            data:data
        })
            .then(response => {
                if(response.status){
                    dispatch({
                        type: ADD_PROFILE,
                        payload: response.data
                    });
                    toast.success(response.data.message)
                }
            })
            .catch(error => {
            })
    }
}

export const ProfileGet=(id)=>{
    return async(dispatch)=>{
        const response = await axios({
            method: 'GET',
            url: `http://localhost:9090/api/v1/profile/${id}`,
        })
            .then(response=> {
                        if(response.status){
                            dispatch({
                                type: GET_PROFILE,
                                payload: response.data
                            });
                        }
            })
            .catch(error => {

            })

    }
}
import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    SEND_OTP
} from '../actionTypes/auth.Types';

import {
    DESTROY_SESSION
} from '../actionTypes/global.Types';
import {toast} from "react-toastify";

export const login = (data) => {

    return async (dispatch) => {

        const response = await axios({
            method: 'POST',
            url: `http://localhost:9090/api/v1/login`,
            data: data
        })
            .then(response=> {
                if (response.status === 200) {
                    localStorage.setItem("auth", JSON.stringify(response.data.userAuth))
                    localStorage.setItem('token', JSON.stringify(response?.data?.userAuth?.token))

                    axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.userAuth?.token;

                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: response.data
                    });
                    toast.success(response.data.message)

                } else {
                    dispatch({
                        type: LOGIN_FAILURE,
                        payload: response.data.message
                    });
                    toast.error(response.data.message||'something went wrong')
                }
            })
            .catch(error => {
                dispatch({
                    type: LOGIN_FAILURE,
                    data: 'inValid user credential'
                });
                toast.error('invalid user credential  !')
            })

    }
}

export const Googlelogin = (data) => {

    return async (dispatch) => {
        const response = await axios.post("http://localhost:9090/api/v1/googlelogin",
            { token: data.tokenObj }, { userObj: data.profileObj })
    .then(response=> {
                if (response.status === 200) {
                    console.log("res",response)
                    localStorage.setItem("auth", JSON.stringify(response.data.userEmail))
                    localStorage.setItem('token', JSON.stringify(response?.data?.userEmail?.token))

                    axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.userAuth?.token;

                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: response.data
                    });
                    toast.success(response.data.message)

                } else {
                    dispatch({
                        type: LOGIN_FAILURE,
                        payload: response.data.message
                    });
                    toast.error(response.data.message||'something went wrong')
                }
            })
            .catch(error => {
                dispatch({
                    type: LOGIN_FAILURE,
                    data: 'inValid user credential'
                });
                toast.error('invalid user credential  !')
            })

    }
}

export const logouts = (id) => {
    return (dispatch) => {
        axios.get(`http://localhost:9090/api/v1/logout/${id} `)
            .then(response => {
                if(response.status){
                    localStorage.removeItem("auth");
                    localStorage.removeItem("token")
                    dispatch({
                        type: LOGOUT_SUCCESS,
                        payload: response.data.data
                    });
                    toast.success('logout successfully')
                    dispatch({ type: DESTROY_SESSION });
                }else{
                    dispatch({
                        type: LOGOUT_FAILURE,
                        payload: response.data.message
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: LOGOUT_FAILURE,
                    data: "Something went wrong"
                });
            })
    }
}


export const sendOtpUser=(data,setOtpCode)=>{
    return async (dispatch)=>{
        let result= await axios.post(`http://localhost:9090/api/v1/sendotp`,data)
            .then(res=>{
                if(res.status){
                    dispatch({
                        type:SEND_OTP,
                        payload:res.data
                    })
                    setOtpCode(res?.data?.otp||0)
                    toast.success('send email successFully')
                }
            })
            .catch(error=>{

        })

    }
}


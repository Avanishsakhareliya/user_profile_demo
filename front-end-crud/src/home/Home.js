import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { login, Googlelogin, sendOtpUser } from '../action/auth.actions'
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';

function Home() {
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.User)
    const [otpCode, setOtpCode] = useState('')
    const [active, setActive] = useState(false)
    let ValidRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const [userData, setUserData] = React.useState({
        email: "",
        password: "",
        otp: ""
    })
    const [userDataError, setUserDataError] = React.useState({})

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: "431875351945-c3jer82heak68n4667ffomglg76dcsds.apps.googleusercontent.com",
                scope: 'email',
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }

    const handleChangeOtp = (e) => {
        const { name, value } = e.target;
        console.log("code", otpCode, value)
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
        if (parseInt(otpCode) === parseInt(value)) {
            setActive(true)
        } else {
            setActive(false)
        }
    }

    useEffect(() => {
        if (auth?.isLoggedIn) {
            navigate("/dashboard");
            setUserData({
                email: "",
                password: "",
                otp: ""
            })
        }
    }, [auth])


    async function handleLogin(googleData) {
        dispatch(Googlelogin(googleData))
    }

    const validation = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) {
                    return 'email requied'
                } else {
                    if (!userData.email.match(ValidRex)) {
                        return 'enter valid email'
                    }
                    else {
                        return ''
                    }
                }
            case 'otp':
                if (!value) {
                    return 'otp required'
                } else {
                    return ''

                }
            case 'password':
                if (!value) {
                    return "please Input password *"
                } else {
                    const uppercaseRegExp = /(?=.*?[A-Z])/;
                    const lowercaseRegExp = /(?=.*?[a-z])/;
                    const digitsRegExp = /(?=.*?[0-9])/;
                    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
                    const minLengthRegExp = /.{8,}/;
                    const passwordLength = userData.password.length;
                    const uppercasePassword = uppercaseRegExp.test(userData.password);
                    const lowercasePassword = lowercaseRegExp.test(userData.password);
                    const digitsPassword = digitsRegExp.test(userData.password);
                    const specialCharPassword = specialCharRegExp.test(userData.password);
                    const minLengthPassword = minLengthRegExp.test(userData.password);
                    if (passwordLength === 0) {
                        return "Password is empty";
                    } else if (!uppercasePassword) {
                        return "At least one Uppercase";
                    } else if (!lowercasePassword) {
                        return "At least one Lowercase";
                    } else if (!digitsPassword) {
                        return "At least one digit";
                    } else if (!specialCharPassword) {
                        return "At least one Special Characters";
                    } else if (!minLengthPassword) {
                        return "At least minumum 8 characters";
                    } else {
                        return "";
                    }
                    // return ""
                }
            default:
                break;
        }
    }
    const onSubmit = () => {
        let allErrors = {}
        Object.keys(userData).forEach(key => {
            const error = validation(key, userData[key])
            if (error && error.length) {
                allErrors[key] = error
            }
        });
        if (Object.keys(allErrors).length) {
            console.log(allErrors)
            return setUserDataError(allErrors)
        } else {
            console.log(userData)
            dispatch(login(userData))
        }

    }

    const sendOtp = async (e) => {
        e.preventDefault()
        let data = {
            email: userData.email
        }
        dispatch(sendOtpUser(data, setOtpCode))

    }

    return (<>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Profile
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>


            <Box
                component="form"
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={3}>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} gap={5} sx={{ marginTop: "10px" }}>
                        <TextField sx={{ width: "100%", marginTop: "5px" }}
                            name='email'
                            value={userData.email}
                            onChange={(e) => handleChange(e)}
                            id="standard-basic"
                            label="Email"
                            variant="standard"
                            helperText={userDataError?.email?.length > 0 ? userDataError?.email : null}
                            error={userDataError?.email?.length > 0 ? true : false}
                        />
                        <TextField sx={{ width: "100%", marginTop: "5px" }}
                            name='password'
                            value={userData.password}
                            onChange={(e) => handleChange(e)}
                            id="standard-basic"
                            label="Password"
                            variant="standard"
                            helperText={userDataError?.password?.length > 0 ? userDataError?.password : null}
                            error={userDataError?.password?.length > 0 ? true : false}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <button onClick={(e) => sendOtp(e)}>send otp</button>
                        </div>
                        <TextField sx={{ width: "100%", marginTop: "5px" }}
                            name='otp'
                            value={userData.otp}
                            onChange={(e) => handleChangeOtp(e)}
                            id="standard-basic"
                            label="OTP"
                            variant="standard"
                            helperText={userDataError?.otp?.length > 0 ? userDataError?.otp : null}
                            error={userDataError?.otp?.length > 0 ? true : false}
                        />
                        <Button sx={{ width: "100%", marginTop: "30px" }} disabled={!active ? true : false} variant="contained" onClick={onSubmit} >Login</Button>
                        <div style={{ marginTop: "20px" }}>
                            <GoogleLogin
                                clientId="431875351945-c3jer82heak68n4667ffomglg76dcsds.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={handleLogin}
                                onFailure={handleLogin}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>

                </Grid>
            </Box>
        </Box>

    </>)
}

export default Home
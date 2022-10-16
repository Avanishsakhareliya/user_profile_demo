import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import user_profile from './User-Profile.png'
import { useDispatch, useSelector } from "react-redux";
import { ProfileGet, ProfileAdd } from '../action/profile.actions'
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import { logouts } from '../action/auth.actions'
import Switch from '@mui/material/Switch';

function Dashboard() {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profile)
    const auth = useSelector((state) => state.User)
    const [userData, setUserData] = React.useState({
        title: '',
        message: '',
        image: ''
    })
    const [userDataError, setUserDataError] = React.useState({})

    let navigate = useNavigate();
    const labels = { inputProps: { 'aria-label': 'Switch demo' } };

    const validation = (name, value) => {
        switch (name) {
            case 'title':
                if (!value) {
                    return 'enter Title'
                } else {
                    return
                }
            case 'message':
                if (!value) {
                    return 'enter message'
                } else {
                    return
                }

            default:
                break;
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }
    useEffect(() => {
        if (profile?.createSuccess) {
            getListCard()
        }
    }, [profile?.createSuccess])

    const onSubmit = () => {
        let allErrors = {}
        Object.keys(userData).forEach(key => {
            const error = validation(key, userData[key])
            if (error && error.length) {
                allErrors[key] = error
            }
        });
        if (Object.keys(allErrors).length) {
            return setUserDataError(allErrors)
        } else {
            dispatch(ProfileAdd(userData))
        }
    }

    useEffect(() => {
        if (profile?.getItemsSuccess) {
            setUserData({
                title: profile?.items?.data?.title,
                message: profile?.items?.data?.message,
                image: profile?.items?.data?.image
            })
        }
    }, [profile])

    const logout = () => {
        const auth = localStorage.getItem('auth')
        const id = JSON.parse(auth)._id;
        dispatch(logouts(id));
        window.location.href = "/";
    }

    const getListCard = async () => {
        const auth = localStorage.getItem('auth')
        const id = JSON.parse(auth)._id
        dispatch(ProfileGet(id))
    }

    const handleImageChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setUserData({ ...userData, image: reader.result })
        }
    }

    useEffect(() => {
        getListCard()
    }, [])
    const changeLung = (e) => {
        if (e === true) {
            document.getElementById("google_translate_element").style.cssText = `
            display: block ;
            position: absolute;
            top: 75vh;
            left: 17%;
            `;
        } else {
            document.getElementById("google_translate_element").style.cssText = `display:none`;
        }
    }
    return (
        <>
            <Grid container>
                <Grid item xs={12} style={{ textAlign: "center", border: '1px solid grey', margin: "10px 21px 10px 21px" }}>
                    <h1>Profile</h1>
                    <Tooltip title="Log Out">
                        <div onClick={() => logout()}>
                            <LogoutIcon />
                        </div>
                    </Tooltip>
                    <div>
                        <Switch {...labels} onChange={(e) => changeLung(e.target.checked)} />

                    </div>
                </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: "center", marginTop: "30px" }}>
                <Card sx={{ maxWidth: 345 }}>
                    <input hidden id='image' accept="image/*" type="file" onChange={(e) => handleImageChange(e)} />
                    <CardMedia
                        component="img"
                        height="140"
                        image={userData.image || user_profile}
                        alt="green iguana"
                        sx={{ objectFit: 'contain' }}
                    />
                    <label htmlFor='image' className='icon-profile'>
                        <div style={{ display: 'flex', justifyContent: "center" }}>
                            <PhotoCamera />
                        </div>
                    </label>
                    <CardContent>
                        <TextField
                            label="full Name"
                            id="outlined-size-small"
                            size="small"
                            name='title'
                            onChange={(e) => handleChange(e)}
                            value={userData?.title}

                        />
                        <span style={{ color: "red" }}>{userDataError?.title}</span>
                        <br />
                        <br />
                        <TextareaAutosize
                            label="Bio"
                            style={{ width: '100%' }}
                            minRows={5}
                            placeholder="Bio"
                            value={userData?.message}
                            name='message'
                            onChange={(e) => handleChange(e)}

                        />
                        <span style={{ color: "red" }}>{userDataError?.message}</span>
                        <br />

                        <Button sx={{ width: "100%", marginTop: "30px" }} variant="contained" onClick={onSubmit} >S a v e</Button>
                    </CardContent>

                </Card>
            </div>

        </>
    )
}

export default Dashboard;
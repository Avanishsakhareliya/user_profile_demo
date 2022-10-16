const express = require("express");
const app = express();
let router = express.Router();
app.use(router);
let bodyParser = require('body-parser')
router.use(bodyParser.json({ limit: '500mb' }))

// controller
const {login,signup,googleLogin,emailVerify} = require("../controller/userController")
const {createNotes, ProfileUser, deleteNotes,logout}=require("../controller/notesController")
router.post('/login',login)
router.post('/signup',signup)
router.post('/googlelogin',googleLogin)
router.post('/sendotp',emailVerify)

// notes----------------
router.post('/create',createNotes)
router.get('/logout/:id',logout)
router.post('/delete/:id',deleteNotes)
router.get('/profile/:id',ProfileUser)
module.exports = router;

const notesmodel = require("../modal/notes")
const usermodel = require("../modal/user")
const TOKEN_KEY = "hellodeveloperforreactjsapp";
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;

module.exports.createNotes = async (req, res) => {
    try {
        const { token } = req.headers;
        const { title, message,image } = req.body;
        const findUser = await usermodel.findOne({ token })
        const userFound=await notesmodel.findOne({useref_id: findUser?._id })
        if(userFound){
            const data = await notesmodel.findOneAndUpdate(findUser?._id, req.body)
            res.send({ data, message: "edit successfully" })
        }else{
            let userData = await notesmodel.create({
                title: title,
                message: message,
                image:image,
                useref_id: findUser?._id
            })
            res.send({ findUser: userData, message: "added successfully" })
        }


    } catch (error) {
        console.log(error)
    }

}

module.exports.listNotes = async (req, res) => {
    try {
        const { token } = req.headers
        const user = await usermodel.findOne({ token })
        const data = await notesmodel.find({ useref_id: user?._id })
        res.send({ data, message: "getted user notes" })

    } catch (error) {
        console.log(error)
    }
}

module.exports.ProfileUser=async (req,res)=>{
    try{
        const data = await notesmodel.findOne({ useref_id: req.params.id })
        res.send({ data, message: "getted user Profile" })
    }
    catch(Err){
        console.log(Err)
    }
}

module.exports.deleteNotes = async (req, res) => {
    try {
        const data = await notesmodel.findByIdAndRemove(req.params.id)
        res.send({ data, message: "delete notes" })

    } catch (error) {
        console.log(error)
    }
}

module.exports.logout=async (req,res)=>{
    try {
        const data = await notesmodel.findOne({ useref_id: req.params.id })
        res.send({ data, message: "logout user" })
    } catch (ex) {
        next(ex);
    }
}
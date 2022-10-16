const usermodel = require("../modal/user")
const TOKEN_KEY = "hellodeveloperforreactjsapp";
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library')
let nodemailer = require('nodemailer');
let ElasticEmail = require('@elasticemail/elasticemail-client');
let defaultClient = ElasticEmail.ApiClient.instance;
let apikey = defaultClient.authentications['apikey'];
apikey.apiKey = "FB8C22E0EFE07FF1E75DD12CF0432F64790B5EC0C0CC1B5351A16C36DD706AEABF1C1023D29380E8AE8A489E10F9CF64"

const client = new OAuth2Client("431875351945-c3jer82heak68n4667ffomglg76dcsds.apps.googleusercontent.com", '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', 'http://localhost:3333');

let transporter = nodemailer.createTransport({
    host: "smtp.elasticemail.com",
    service: "smtp.elasticemail.com",
    port: 2525,
    auth: {
        user: "abcdxyz2811@gmail.com",
        pass: "FBCFD62CF3434A9AC437A2B1667A654C33BB"
    }
});

let api = new ElasticEmail.EmailsApi()



transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages!", success);
    }
})

function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

module.exports.login = async (req, res) => {

    const { email, password, otp } = req.body;
    const user = await usermodel.findOne({ email: email })
    if (user) {
        const comper = await bcrypt.compare(password, user.password);
        if (comper) {
            let userAuth = {
                email: user.email,
                token: user.token,
                _id: user._id
            }
            res.status(200).send({ message: "user successFully Login", comper, userAuth })
        } else {
            res.status(201).send({ message: "password does not match" })
        }
    } else {
        res.status(401).send({ message: "invalid user Creadentials" })
    }
}

module.exports.emailVerify = async (req, res) => {
    const { email } = req.body;
    let otp = generateOTP()
    let emails = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient(email)
        ],
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                    ContentType: "HTML",
                    Content: `please enter OTP for your verify email \\n OTP: ${otp}`
                })
            ],
            Subject: "Verify",
            From: "abcdxyz2811@gmail.com "
        }
    });

    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully.');
        }
    };
    api.emailsPost(emails, callback);
    res.status(200).send({ message: "get otp", otp })


}

module.exports.signup = async (req, res) => {
    const { email, password } = req.body
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const salt = await bcrypt.genSalt(10)
    const passwords = await bcrypt.hash(password, salt)
    const userData = await usermodel.findOne({ email: email })
    if (userData) {
        res.send({ message: "user already exists!" })
    }
    else {
        if (email.match(validRegex)) {
            var tokens = jwt.sign({ email }, TOKEN_KEY, {
                expiresIn: 86400 // expires in 24 hours
            });
            const resData = await usermodel.create({
                email: email,
                password: passwords,
                token: tokens
            })
            console.log(resData)
            res.status(200).send({ message: "user created successFully", resData })
        } else {
            res.status(201).send({ message: "email not valid" })
        }
    }
}

module.exports.logout = async (req, res) => {
    try {
        return res.json({ message: "logout successfully" })
    } catch (error) {
        next(error)
    }
}

module.exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body
        const ticket = await client.verifyIdToken({
            idToken: token?.id_token,
            audience: "431875351945-c3jer82heak68n4667ffomglg76dcsds.apps.googleusercontent.com"
        });
        const { name, email, picture } = ticket.getPayload();
        const userEmail = await usermodel.findOne({ email: email })
        if (userEmail) {
            res.status(200).send({ message: "login successfully", userEmail })
        } else {
            let tokens = jwt.sign({ email }, TOKEN_KEY, {
                expiresIn: 86400 // expires in 24 hours
            });
            const user = await usermodel.create({
                email, password: "", picture, token: tokens
            })
            user.save()
        }
    } catch (error) {
        console.log(error);
    }
}
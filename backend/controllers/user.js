const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../Models/User')


module.exports.signup = async (req, res, next) => {
    const { email, password } = req.body;
    const hashedPsw = await bcrypt.hash(password, 10)
    console.log(email)
    console.log(email, password);
    try {
        const newUser = new User({
            email: email,
            password: hashedPsw
        });
        const userToSave = await newUser.save()
        console.log(newUser)
        res.json({
            msg: "user added",
            user: userToSave
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "We already have that user!"
        })
    }
}

module.exports.login= (req, res, next) => {
    const { email, password } = req.body;
    let fetchedUser;

    User.findOne({ email: email })
        .then(user => {
            console.log(user, " right after finding user in post login")
            if (!user) {
                const err = new Error('there is no user who goes by that email!')
                throw err
            }
            fetchedUser= user  // uzywamy tego bo kiedy zrwcamy zde bcryptowany object to nie ma tam userId
            return bcrypt.compare(password, user.password)

        }).then(comparedUser => {
            if (!comparedUser) {
                const err = new Error('incorect password!');
                throw err
            }
            const token = jwt.sign({ email: email, userId: fetchedUser._id },
                "supersecretsecret",
                { expiresIn: "1h" });
            console.log(`our re3trived token : ${token}`);

            res.status(200).json({
                user: comparedUser.email,
                token: token,
                msg: "Youre logged IN!",
                expiresIn: 3600,
                userId: fetchedUser._id 
            })
            return
        })
        .catch(err => {
            console.log("our error " + err)
            err.toString()
            res.status(500).json({ msg: err.message})

        })

}
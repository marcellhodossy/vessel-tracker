const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {transporter} = require('../../../config/transporter.js');
const { pool } = require('../../../config/postgresql.js');
const pg = require('pg');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


router.post('/forgot', async (req, res) => {

if(req.body.email == null)
{
    req.session.error = "Email address is required.";
    req.session.save();
    return res.redirect('/forgot');
}

if(emailRegex.test(req.body.email)) {

    const data = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);

    if(data.rows.length > 0) {
    const token = jwt.sign({id: data.rows[0].id, token: data.rows[0].token_value}, process.env.JWT_SECRET, {expiresIn: '30M'});

    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: data.rows[0].email,
        subject: "Reset Password",
        html: `<h1>Reset Password</h1> <span>${process.env.LINK}/reset?token=${token}</span>`
    }

    await transporter.sendMail(mailOptions);

    req.session.sended = data.rows[0].id;
    req.session.save();
    res.redirect('/sended')


    } else {
    req.session.error = "The user does not exists.";
    req.session.save();
    return res.redirect('/forgot');
    }

} else {
    req.session.error = "The email format is incorrect.";
    req.session.save();
    return res.redirect('/forgot');
}

});

module.exports = router
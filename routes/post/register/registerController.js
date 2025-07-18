const express = require('express');
const router = express.Router();
const {pool} = require('../../../config/postgresql.js');
const pg = require('pg');
const {hashPassword, verifyPassword} = require('../../../config/argon.js');
const { createJWT, validateJWT } = require('../../../config/jsonwebtoken.js');
const {transporter} = require('../../../config/transporter.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    
    const decoded = await validateJWT(req.session.token);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(decoded != null) {
        return res.redirect('/users/')
    }

    const {username, email, password} = req.body;

    if(username.length < 8) {
        req.session.error = "The username minimal length is 8 characters.";
        req.session.save();
        res.redirect('/register');
    } else if(password.length < 8) {
        req.session.error = "The password minimal length is 8 characters.";
        req.session.save();
        res.redirect('/register');
    } else if(emailRegex.test(email) == false) {
        req.session.error = "The email format is incorrect.";
        req.session.save();
        res.redirect('/register');
    } else {

        const username_check = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if(username_check.rows.length > 0) {
            req.session.error = "The username is taken.";
            req.session.save();
            return res.redirect('/register');
        }

        const email_check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(email_check.rows.length > 0) {
            req.session.error = "The email address is taken.";
            req.session.save();
            return res.redirect('/register');
        }

        const encrypted_password = await hashPassword(password);

        const create = await pool.query("INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id", [username, email, encrypted_password]);

        const mailOptions = {
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: "Confirm Email",
            html: `<h1>Confirm Email</h1> ${process.env.LINK}/register/confirm?token=${jwt.sign({id: create.rows[0].id, token: 0}, process.env.JWT_SECRET, {expiresIn: '30m'})}<span>This link is valid for 30 minutes.</span>`
        }

        await transporter.sendMail(mailOptions);

        req.session.sended = create.rows[0].id;
        req.session.save();
        res.redirect('/sended');


    }
    
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {validateJWT} = require('../../../config/jsonwebtoken.js');
const {pool} = require('../../../config/postgresql.js');
const pg = require('pg');
const {verifyPassword} = require('../../../config/argon.js');

router.post('/users/settings/change_username', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(decoded != null) {
        
        const {password, new_username} = req.body;

        if(!password && !new_username) {
            req.session.error = "Fields are required";
            req.session.save();
            return res.redirect('/users/settings');
        }

        if(new_username < 8) {
            req.session.error = "The username length is minimum 8 characters.";
            req.session.save();
            return res.redirect('/users/settings');
        }

        if(password.length < 8) {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings');
        } else {
            const check = await pool.query("SELECT * FROM users WHERE username = $1", [new_username]);

            if(check.rows.length > 0) {
            req.session.error = "This username is taken.";
            req.session.save();
            res.redirect('/users/settings'); 
            } else {

            const passwd_check = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
            
            if(verifyPassword(passwd_check.rows[0].password, password)) {

            await pool.query("UPDATE users SET username = $1 WHERE id = $2", [new_username, decoded.id]);
            req.session.success = "The username change is successful.";
            req.session.save();
            res.redirect('/users/settings'); 

            } else {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings'); 
            }

            }
        }


    } else {
        res.clearCookie("token");
        req.session.destroy();
        res.redirect('/');
    }

});

module.exports = router;
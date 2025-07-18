const express = require('express');
const router = express.Router();
const {validateJWT} = require('../../../config/jsonwebtoken.js');
const {pool} = require('../../../config/postgresql.js');
const pg = require('pg');
const {verifyPassword} = require('../../../config/argon.js');

router.post('/users/settings/change_email', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(decoded != null) {
        
        const {password, new_email} = req.body;

        if(!password && !new_email) {
            req.session.error = "Fields are required";
            req.session.save();
            return res.redirect('/users/settings');
        }

        if(password.length < 8) {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings');
        } else if(emailRegex.test(new_email)) {
            const check = await pool.query("SELECT * FROM users WHERE email = $1", [new_email]);

            if(check.rows.length > 0) {
            req.session.error = "This email address is taken.";
            req.session.save();
            res.redirect('/users/settings'); 
            } else {

            const passwd_check = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
            
            if(verifyPassword(passwd_check.rows[0].password, password)) {

            await pool.query("UPDATE users SET email = $1 WHERE id = $2", [new_email, decoded.id]);
            req.session.success = "The email change is successful.";
            req.session.save();
            res.redirect('/users/settings'); 

            } else {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings'); 
            }

            }
        } else {
            req.session.error = "The email format is incorrect.";
            req.session.save();
            res.redirect('/users/settings'); 
        }


    } else {
        res.clearCookie("token");
        req.session.destroy();
        res.redirect('/');
    }

});

module.exports = router;
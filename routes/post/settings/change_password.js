const express = require('express');
const router = express.Router();
const {validateJWT} = require('../../../config/jsonwebtoken.js');
const {pool} = require('../../../config/postgresql.js');
const pg = require('pg');
const {verifyPassword, hashPassword} = require('../../../config/argon.js');

router.post('/users/settings/change_password', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded != null) {
        
        const {password, new_password} = req.body;

        if(!password && !new_password) {
            req.session.error = "Fields are required";
            req.session.save();
            return res.redirect('/users/settings');
        }

        if(new_password < 8) {
            req.session.error = "The password length is minimum 8 characters.";
            req.session.save();
            return res.redirect('/users/settings');
        }

        if(password.length < 8) {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings');
        } else if(new_password.length >= 8) {

            const passwd_check = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
            
            if(verifyPassword(passwd_check.rows[0].password, password)) {

            await pool.query("UPDATE users SET password = $1, token_value = token_value + 1 WHERE id = $2", [await hashPassword(new_password), decoded.id]);
            req.session.success = "The password change is successful.";
            req.session.save();
            res.redirect('/users/settings'); 

            } else {
            req.session.error = "The password is incorrect.";
            req.session.save();
            res.redirect('/users/settings'); 
            }

           } else {
            req.session.error = "Password must be 8 characters long.";
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
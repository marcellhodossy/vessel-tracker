const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken.js');
const pg = require('pg');
const { pool } = require('../../../config/postgresql');
const { transporter } = require('../../../config/transporter.js');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/register/resend', async (req, res) => {
    
    

    if(req.cookies.token != null) {
        res.redirect('/');
    } else if(req.session.user_id) {
        const check = await pool.query("SELECT * FROM users WHERE token_value = 0 AND id = $1", [req.session.user_id]);

        if(check.rows.length > 0) {
            
            const mailOptions = {
                from: process.env.SMTP_USERNAME,
                to: check.rows[0].email,
                subject: "Confirm Email",
                html: `<h1>Confirm Email</h1> ${process.env.LINK}/register/confirm?token=${jwt.sign({id: check.rows[0].id, token: 0}, process.env.JWT_SECRET, {expiresIn: '30m'})}<span>This link is valid for 30 minutes.</span>`
            }
            
            await transporter.sendMail(mailOptions);
            req.session.sended = check.rows[0].id;
            req.session.user_id = null;
            req.session.save();
            res.redirect('/sended');
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');

    }

});

module.exports = router;
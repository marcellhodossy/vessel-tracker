const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {transporter} = require('../../../config/transporter.js');
const { pool } = require('../../../config/postgresql.js');
const pg = require('pg');
const { validateJWT } = require('../../../config/jsonwebtoken.js');
const { hashPassword } = require('../../../config/argon.js');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


router.post('/reset', async (req, res) => {

if(req.body.password == null)
{
    req.session.error = "Password is required.";
    req.session.save();
    return res.redirect(res.get('Referer'));
}

const decoded = await validateJWT(req.session.token);

if(decoded != null) {

const encrypted_password = await hashPassword(req.body.password);

await pool.query("UPDATE users SET password = $1 WHERE id = $2", [encrypted_password, decoded.id]);

req.session.destroy();
res.redirect('/');

} else {
    req.session.error = "The token is invalid.";
    req.session.save();
    return res.redirect('/forgot');
}

});

module.exports = router
const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken.js');
const { pool } = require('../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.post('/users/myroutes/create', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    }

    const check = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND name = $2", [decoded.id, req.body.name]);

    if(check.rows.length > 0) {
        req.session.error = "It already has such a name route.";
        req.session.save();
        return res.redirect('/users/myroutes/');
    }

    await pool.query("INSERT INTO routes (name, user_id) VALUES ($1,$2)", [req.body.name, decoded.id]);
    res.redirect('/users/myroutes/');

});

module.exports = router;

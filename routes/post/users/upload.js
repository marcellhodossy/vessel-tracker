const express = require('express');
const { pool } = require('../../../config/postgresql.js');
const pg = require('pg');
const { validateJWT } = require('../../../config/jsonwebtoken.js');
const router = express.Router();

router.post('/users/myroutes/upload', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.status(400).send();
    } 

    const check = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND groups = FALSE AND id = $2", [decoded.id, req.body.id]);

    if(check.rows.length == 0) {
        res.status(400).send();
    }

    await pool.query("INSERT INTO positions (route_id, lat, lng, timestamp) VALUES ($1,$2,$3,$4)", [req.body.id, req.body.lat, req.body.lng, req.body.time]);
    res.status(200).send();
});

module.exports = router;
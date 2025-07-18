const express = require('express');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const router = express.Router();

router.get('/users/myroutes/views/:id', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        res.redirect('/');
    }

    const check = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND id = $2", [decoded.id, req.params.id]);

    if(check.rows.length > 0)
    {
        const positions = [];

        const pos = await pool.query("SELECT * FROM positions WHERE route_id = $1", [req.params.id]);

for(let i = 0; i < pos.rows.length; i++) {
    positions.push({
        lat: pos.rows[i].lat,
        lng: pos.rows[i].lng,
        timestamp: pos.rows[i].timestamp
    });
}


        res.render('myroutes/map.ejs', {
            positions: positions
        });
    } else {
        req.session.error = "You are not authorised to view this map.";
        req.session.save();
        res.redirect('/users/myroutes/');
    }

});

module.exports = router;
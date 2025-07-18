const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/groups/:id/views/:map', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    }

    const check = await pool.query("SELECT * FROM members WHERE user_id = $1 AND group_id = $2", [decoded.id, req.params.id]);

    if(check.rows.length == 0)
    {
        return res.redirect('/users/groups/')
    }

const route = await pool.query("SELECT * FROM routes WHERE groups = TRUE AND group_id = $1 AND id = $2", [req.params.id, req.params.map]);

    if(route.rows.length == 0) {
        return res.redirect(`/users/groups/${req.params.id}`);
    }

            const positions = [];

        const pos = await pool.query("SELECT * FROM positions WHERE route_id = $1", [req.params.map]);

for(let i = 0; i < pos.rows.length; i++) {
    positions.push({
        lat: pos.rows[i].lat,
        lng: pos.rows[i].lng,
        timestamp: pos.rows[i].timestamp
    });
}


        res.render('groups/map.ejs', {
            positions: positions,
            group_id: req.params.id,
        });





req.session.error = null;
req.session.success = null;
req.session.save();

});

module.exports = router;

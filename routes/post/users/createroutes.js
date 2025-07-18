const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken.js');
const { pool } = require('../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.post('/users/groups/:id/create', async (req, res) => {

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

    const check_2 = await pool.query("SELECT * FROM routes WHERE name = $1 AND group_id = $2", [req.body.name, req.params.id]);

    if(check_2.rows.length == 0) {
        await pool.query("INSERT INTO routes (group_id, groups, name, user_id) VALUES ($1,$2,$3,$4)", [req.params.id, true, req.body.name, decoded.id]);
        req.session.success = "The route was successfully created.";
        req.session.save();
        res.redirect(`/users/groups/${req.params.id}`);
    } else {
        req.session.error = "It already has such a name route.";
        req.session.save();
        res.redirect(`/users/groups/${req.params.id}`);
    }


});

module.exports = router;

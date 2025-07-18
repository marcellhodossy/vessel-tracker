const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/groups/:id/leave', async (req, res) => {

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

    const check_2 = await pool.query("SELECT * FROM groups WHERE owner_id = $1", [decoded.id]);

    if(check_2.rows.length > 0) {
        return res.redirect(`/users/groups/${req.params.id}`);
    }

    await pool.query("DELETE FROM members WHERE user_id = $1 AND group_id = $2", [decoded.id, req.params.id]);

    req.session.success = "The exit is successful.";
    req.session.save();
    res.redirect('/users/groups/');


});

module.exports = router;

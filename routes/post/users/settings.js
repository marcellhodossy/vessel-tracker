const express = require('express');
const pg = require('pg');
const { pool } = require('../../../config/postgresql');
const { validateJWT } = require('../../../config/jsonwebtoken');
const router = express.Router();

router.post('/users/groups/:id/settings', async (req,res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    }

    const check = await pool.query("SELECT * FROM groups WHERE owner_id = $1", [decoded.id]);

    if(check.rows.length == 0) {
        return res.redirect(`/users/groups/${req.params.id}`);
    }

        const check_2 = await pool.query("SELECT * FROM groups WHERE name = $1", [req.body.name]);

    if(check_2.rows.length > 0) {
                req.session.error = "A group with this name already exists.";
        req.session.save();
        return res.redirect(`/users/groups/${req.params.id}`);
    }

    await pool.query("UPDATE groups SET name = $1 WHERE id = $2", [req.body.name, req.params.id]);

    return res.redirect(`/users/groups/${req.params.id}`);
    
});

module.exports = router;
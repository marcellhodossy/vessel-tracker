const express = require('express');
const pg = require('pg');
const { pool } = require('../../../config/postgresql');
const { validateJWT } = require('../../../config/jsonwebtoken');
const router = express.Router();

router.post('/users/groups/create', async (req,res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    }

    const check = await pool.query("SELECT * FROM groups WHERE name = $1", [req.body.name]);

    if(check.rows.length > 0) {
        req.session.error = "Your group was not created because there is already a group with that name.";
        req.session.save();
        res.redirect('/users/groups/');
    } else {
        const random = Math.floor(Math.random() * 1000000);
        const data = await pool.query("INSERT INTO groups (name, owner_id, code) VALUES ($1,$2,$3) RETURNING ID", [req.body.name, decoded.id, random]);
        await pool.query("INSERT INTO members (group_id, user_id) VALUES ($1,$2)", [data.rows[0].id, decoded.id]);
        req.session.success = "The group has been successfully completed.";
        req.session.save();
        res.redirect('/users/groups/');
    }

});

module.exports = router;
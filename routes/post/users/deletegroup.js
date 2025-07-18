const express = require('express');
const pg = require('pg');
const { pool } = require('../../../config/postgresql');
const { validateJWT } = require('../../../config/jsonwebtoken');
const router = express.Router();

router.get('/users/groups/:id/delete', async (req,res) => {

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

    await pool.query("DELETE FROM routes WHERE group_id = $1", [req.params.id]);
    await pool.query("DELETE FROM groups WHERE id = $1", [req.params.id]);
    await pool.query("DELETE FROM members WHERE group_id = $1", [req.params.id]);

    return res.redirect(`/users/groups/${req.params.id}`);
});

module.exports = router;
const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/myroutes/delete/:id', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    } 

    const check = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND groups = FALSE AND id = $2", [decoded.id, req.params.id]);

    if(check.rows.length == 0) {
        return res.redirect('/users/myroutes/');
    }

    await pool.query("DELETE FROM routes WHERE id = $1", [req.params.id]);
    await pool.query("DELETE FROM positions WHERE route_id = $1", [req.params.id]);
    res.redirect('/users/myroutes/');

});

module.exports = router;
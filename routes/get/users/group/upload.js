const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/groups/:groups/upload/:id', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    } 

const check = await pool.query("SELECT * FROM routes WHERE id = $1 AND group_id = $2 AND groups = TRUE", [req.params.id, req.params.groups]); 

    if(check.rows.length == 0) {
        return res.redirect('/users/groups/');
    }

    res.render('groups/upload.ejs', {
        id: req.params.id,
        link: process.env.LINK,
        token: req.cookies.token,
        groups_id: req.params.groups
    });

});

module.exports = router;
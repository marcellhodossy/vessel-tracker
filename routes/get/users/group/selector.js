const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/groups', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    } 

const members = await pool.query(`SELECT members.*, groups.id AS group_id, groups.name AS group_name FROM members JOIN groups ON members.group_id = groups.id WHERE members.user_id = $1`,[decoded.id] ); 

const groups = [];

    for (let i = 0; i < members.rows.length; i++) {
    groups.push({
        name: members.rows[i].group_name,
        id: members.rows[i].group_id
    });
}

res.render('groups/select.ejs', { 
    groups: groups,
    error: req.session.error,
    success: req.session.success
});

req.session.error = null;
req.session.success = null;
req.session.save();

});

module.exports = router;

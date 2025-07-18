const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken');
const { pool } = require('../../../config/postgresql');
const router = express.Router();


router.post('/users/groups/join', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    }

    const groupsdata = await pool.query("SELECT * FROM groups WHERE code = $1", [req.body.code]);
    
    if(groupsdata.rows.length == 0) {
        req.session.error = "No such group currently exists.";
        req.session.save();
        return res.redirect('/users/groups/')
    }

    await pool.query("INSERT INTO members (user_id, group_id) VALUES ($1,$2)", [decoded.id, groupsdata.rows[0].id]);
    res.redirect(`/users/groups/${groupsdata.rows[0].id}/`);

});

module.exports = router;
const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/groups/:id/', async (req, res) => {

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

const route = await pool.query("SELECT * FROM routes WHERE group_id = $1 AND groups = TRUE",[req.params.id]); 

const routes = [];

    for (let i = 0; i < route.rows.length; i++) {
    routes.push({
        name: route.rows[i].name,
        timestamp: route.rows[i].timestamp,
        author: "asd",
        id: route.rows[i].id
    });
}

const groupdata = await pool.query("SELECT * FROM groups WHERE id = $1", [req.params.id]);

let moderator;

if(groupdata.rows[0].owner_id == decoded.id) {
     moderator = true;
} else {
     moderator = false;
}

res.render('groups/main.ejs', {
    routes: routes,
    group_id: req.params.id,
    error: req.session.error,
    success: req.session.success,
    moderator: moderator,
    code: groupdata.rows[0].code,
    name: groupdata.rows[0].name
});

req.session.error = null;
req.session.success = null;
req.session.save();

});

module.exports = router;

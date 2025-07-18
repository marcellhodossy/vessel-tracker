const express = require('express');
const { validateJWT } = require('../../../../config/jsonwebtoken.js');
const { pool } = require('../../../../config/postgresql.js');
const pg = require('pg');
const router = express.Router();

router.get('/users/myroutes', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded == null) {
        res.clearCookie("token");
        req.session.destroy();
        return res.redirect('/');
    } 

    const route = await pool.query("SELECT * FROM routes WHERE user_id = $1 AND groups = FALSE", [decoded.id]);

    var routes = [];

    for(let i = 0; i < route.rows.length; i++) {

        routes[i] = {"id" : route.rows[i].id, "routes" : route.rows[i].name, "timestamp": route.rows[i].timestamp };

    }


    res.render('myroutes/main.ejs', {
        username: decoded.username,
        routes: routes,
        error: req.session.error,
        success: req.session.success
    });

    req.session.error = null;
    req.session.success = null;
    req.session.save();



});

module.exports = router;
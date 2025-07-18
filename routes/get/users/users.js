const express = require('express');
const router = express.Router();
const {validateJWT} = require('../../../config/jsonwebtoken.js')

router.get('/users/', async (req, res) => {
        const decoded = await validateJWT(req.cookies.token);

    if(decoded != null) {
        res.render('users.ejs', {
            username: decoded.username
        });
    } else {
        res.clearCookie("token");
        req.session.destroy();
        res.redirect('/');
    }

});

module.exports = router;
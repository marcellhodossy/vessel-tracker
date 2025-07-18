const express = require('express');
const router = express.Router()
const {validateJWT} = require('../../../config/jsonwebtoken.js');

router.get('/users/settings', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded != null) {
        res.render('settings.ejs', {
            success: req.session.success,
            error: req.session.error
        });
        req.session.success = null;
        req.session.error = null;
        req.session.save();
    } else {
        res.clearCookie("token");
        req.session.destroy();
        res.redirect('/');
    }

});

module.exports = router;
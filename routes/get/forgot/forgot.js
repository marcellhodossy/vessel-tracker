const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken');
const router = express.Router();

router.get('/forgot', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

    if(decoded != null) {
        res.redirect('/users/');
    } else {
        res.render('forgot.ejs', {
            error: req.session.error
        });

        req.session.error = null;
        req.session.save();
    }

});

module.exports = router;
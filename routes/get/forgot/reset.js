const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken');
const router = express.Router();

router.get('/reset', async (req, res) => {

    const decoded = await validateJWT(req.cookies.token);

if(decoded != null) {
    return res.redirect('/users/');
}

    const decoded_1 = await validateJWT(req.query.token);

if(decoded_1 == null) {
    req.session.error = "Token is invalid.";
    req.session.save();
    res.redirect('/forgot');
} else {
    req.session.token = req.query.token;
    req.session.save();
    res.render('reset.ejs', {
        error: req.session.error
    });
    req.session.error = null;
    req.session.save();
}

});

module.exports = router;
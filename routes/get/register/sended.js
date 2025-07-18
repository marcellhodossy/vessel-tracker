const express = require('express');
const router = express.Router();
const {pool} = require('../../../config/postgresql.js');
const {transporter} = require('../../../config/transporter.js');

router.get('/sended', (req, res) => {
    if(req.cookies.token) {
        res.redirect('/users/')
    } else {
        if(req.session.sended != null) {
    res.render('sended.ejs');
    req.session.sended = null;
    req.session.save();
        } else {
            res.redirect('/');
        }
}
});

module.exports = router;
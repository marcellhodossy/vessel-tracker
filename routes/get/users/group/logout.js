const express = require('express');
const router = express.Router();

router.get('/users/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie("token");
    res.redirect('/');
});

module.exports = router;
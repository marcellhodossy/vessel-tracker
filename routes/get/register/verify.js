const express = require('express');
const { validateJWT } = require('../../../config/jsonwebtoken');
const { pool } = require('../../../config/postgresql');
const router = express.Router();

router.get('/register/confirm', async (req, res) => {

    if(req.query.token == null) {
        res.redirect('/');
    } else {
        const decoded = await validateJWT(req.query.token);
        
        if(decoded == null) {
            res.redirect('/');
        } else {
            await pool.query("UPDATE users SET token_value = 1 WHERE id = $1 AND token_value = 0", [decoded.id]);
            res.redirect('/');
        }
    }

});

module.exports = router;
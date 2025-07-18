const jwt = require('jsonwebtoken');
const pg = require('pg');
const {pool} = require('./postgresql.js');

function createJWT(id, token) {
    return jwt.sign({id: id, token: token}, process.env.JWT_SECRET, {expiresIn: '30d'});    
}

async function validateJWT(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const check = await pool.query("SELECT * FROM users WHERE id = $1 AND token_value = $2", [decoded.id, decoded.token]);
    
        if(check.rows.length > 0) {
            return {id: decoded.id, username: check.rows[0].username, email: check.rows[0].email};
        } else {
            return null;
        }
    }

    catch {
        return null;
    }
}

module.exports = {createJWT, validateJWT};
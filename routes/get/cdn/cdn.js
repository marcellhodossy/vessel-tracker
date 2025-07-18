const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/cdn/:file', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../content/icon.svg'));
});

module.exports = router;
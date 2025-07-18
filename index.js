const express = require('express');
const session = require('express-session');
const CookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const PgSession = require('connect-pg-simple')(session);

const app = express();
const {pool} = require('./config/postgresql.js');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 3600 * 1000
    },
    store: new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    })
}));
app.use(CookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

function LoadRoutes(dir) {
    fs.readdir(dir, {withFileTypes: true}, (error, files) => {

        if(error) {
            console.error(error);
        }

        for(const file of files)    
        {
            const fullPath = path.join(dir, file.name)

            if(file.isDirectory()) {
                LoadRoutes(fullPath);
            } else if(file.isFile() && file.name.endsWith('.js')) {
                app.use(require(fullPath));
            }
        }
    });
}

LoadRoutes(path.join(__dirname, 'routes/'));

app.listen(process.env.PORT, () => {
    console.log(`server listened: ${process.env.LINK}:${process.env.PORT}`);
});
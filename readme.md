Install the package first.
npm install

Then configure the postgresql database based on data.sql.
Then set up the data in .env.

It is recommended to use pm2.
npx pm2 start index.js --name tracker

We are ready.

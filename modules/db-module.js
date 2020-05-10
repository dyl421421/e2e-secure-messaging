const { Pool } = require('pg');
const pgClient = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

module.exports = {
    query: (text, params, callback) => {
        return pgClient.query(text, params, callback);
    }
};
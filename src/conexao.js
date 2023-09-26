const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "192.168.2.4",
  database: "market_cubos",
  password: "123456",
  port: 5432,
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query,
    pool
}
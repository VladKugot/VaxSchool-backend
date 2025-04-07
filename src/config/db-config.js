require('dotenv').config();

const {
    DB_TEST_HOST,
    DB_TEST_USERNAME,
    DB_TEST_PASSWORD,
    DB_TEST_DATABASE,
    DB_TEST_PORT,
    DB_TEST_TYPE,
} = process.env;

module.exports = {
    test: {
        database: DB_TEST_DATABASE || "tvk_test",
        username: DB_TEST_USERNAME || "root",
        password: DB_TEST_PASSWORD || "root",
        host: DB_TEST_HOST || "localhost",
        port: DB_TEST_PORT || 3306,
        dialect: DB_TEST_TYPE || "mysql"
    },
}

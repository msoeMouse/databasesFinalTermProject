/**
 * Creates a connection to database. Reused from Homework 9
 * @return a connection manager
 * @throws SQLException if connection fails
 */
static Connection connect() throws SQLException {
    String host = envOr("DB_HOST", "localhost");
    String port = envOr("DB_PORT", "3306");
    String db = envOr("DB_NAME", "campustix");
    String url = "jdbc:mysql://" + host + ":" + port + "/" + db;
    // TODO: Change root to a low-priority user
    return DriverManager.getConnection(url, envOr("DB_USER", "root"), System.getenv("DB_PASSWORD"));
}
package backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ReviewApp interacts with the database, either to read reviews or update entries (fix this description)
 */
public class ReviewApp {
    /**
     * Creates a connection to database. Reused from Homework 9
     * @return a connection manager
     * @throws SQLException if connection fails
     */
    static Connection connect() throws SQLException {
        String host = envOr("DB_HOST", "localhost");
        String port = envOr("DB_PORT", "3306");
        String db = envOr("DB_NAME", "cafeteriareviewdb");
        String url = "jdbc:mysql://" + host + ":" + port + "/" + db;
        // TODO: Change root to a low-priority user
        return DriverManager.getConnection(url, envOr("DB_USER", "root"), System.getenv("DB_PASSWORD"));
    }

    static String envOr(String name, String fallback) {
        String v = System.getenv(name);
        return v == null ? fallback : v;
    }

    /**
     * On a specific date, return the whole menu as an array
     * @param conn Connection to database
     * @param date Date to filter by
     * @return an array list containing each menu item served on a date
     * @throws SQLException should the query not execute correctly
     */
    static List<Object[]> getMenuFromDate(Connection conn, Date date) throws SQLException {
        List<Object[]> rows = new ArrayList<>();
        String sql = "SELECT m.itemName, m.itemDescription, m.calories " +
                "FROM menuItemListing ml " +
                "JOIN menuItem m ON m.menuItemId = ml.menuItemId " +
                "WHERE ml.menuDate = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDate(1, date);
            //now add a row
            try(ResultSet rs = ps.executeQuery()) {
                while(rs.next()) {
                    Object[] columns = {
                            rs.getString(1),
                            rs.getString(2),
                            rs.getInt(3)
                    };
                    rows.add(columns);
                }
            }
        }
        return rows;
    }
}
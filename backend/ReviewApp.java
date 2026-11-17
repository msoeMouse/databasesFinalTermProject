package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * HTTP API and JDBC operations for the cafeteria review application.
 */
public class ReviewApp {
    private static final String FRONTEND_DIR = envOr("FRONTEND_DIR", "frontend");

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(envOr("HTTP_PORT", "8080"));
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/api/login", ReviewApp::handleLogin);
        server.createContext("/api/signup", ReviewApp::handleSignup);
        server.createContext("/api/menu", ReviewApp::handleMenu);
        server.createContext("/", ReviewApp::handleFrontend);
        server.start();
        System.out.println("Application running at http://localhost:" + port);
    }

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
        String password = System.getenv("DB_PASSWORD");
        if (password == null) {
            throw new SQLException("DB_PASSWORD environment variable is required");
        }
        return DriverManager.getConnection(url, envOr("DB_USER", "root"), password);
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

    /**
     * Adds a user to the program if valid
     * @param conn connection
     * @param email user submitted email, which must be unique
     * @param password user submitted password
     * @throws SQLException on a duplicate user
     */
    static void addUser(Connection conn, String email, String password) throws SQLException {
        String sql = "INSERT INTO Account (email, password) VALUES (?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);
            ps.executeUpdate();
        }
    }

    static int login(Connection conn, String email, String password) throws SQLException {
        String sql = "SELECT accountId FROM Account WHERE email = ? AND password = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt("accountId") : -1;
            }
        }
    }

    /**
     * Take the user's id and submit a review for a select menu item under their name
     * @param conn connection
     * @param userId get this from the logged-in user
     * @param menuItem get this from the selected menu item
     * @param menuDate get this from the selected menu item
     * @param rating get this from the front-end menu
     * @throws SQLException if the connection or review is faulty
     */
    static void submitReview(Connection conn, int userId, int menuItem, Date menuDate, int rating)
    throws SQLException {
        String sql = "INSERT INTO review VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, menuItem);
            ps.setDate(3, menuDate);
            ps.setInt(4, rating);

            ps.execute();
            conn.commit();
        } catch (SQLException e) {
            conn.rollback();
            System.err.println("Cannot submit review");
        }
    }

    private static void handleLogin(HttpExchange exchange) throws IOException {
        if (!requirePost(exchange, "/api/login")) {
            return;
        }
        Map<String, String> form = readForm(exchange);
        String email = form.get("email");
        String password = form.get("password");
        if (isBlank(email) || isBlank(password)) {
            sendJson(exchange, 400, "{\"error\":\"Email and password are required\"}");
            return;
        }

        try (Connection conn = connect()) {
            int accountId = login(conn, email, password);
            if (accountId == -1) {
                sendJson(exchange, 401, "{\"error\":\"Invalid email or password\"}");
            } else {
                sendJson(exchange, 200, "{\"accountId\":" + accountId + "}");
            }
        } catch (SQLException e) {
            System.err.println("Login request failed: " + e.getMessage());
            sendJson(exchange, 500, "{\"error\":\"Unable to complete login\"}");
        }
    }

    private static void handleSignup(HttpExchange exchange) throws IOException {
        if (!requirePost(exchange, "/api/signup")) {
            return;
        }
        Map<String, String> form = readForm(exchange);
        String email = form.get("email");
        String password = form.get("password");
        if (isBlank(email) || isBlank(password)) {
            sendJson(exchange, 400, "{\"error\":\"Email and password are required\"}");
            return;
        }

        try (Connection conn = connect()) {
            addUser(conn, email, password);
            sendJson(exchange, 201, "{\"message\":\"Account created\"}");
        } catch (SQLException e) {
            if (e.getSQLState() != null && e.getSQLState().startsWith("23")) {
                sendJson(exchange, 409, "{\"error\":\"An account with that email already exists\"}");
            } else {
                System.err.println("Signup request failed: " + e.getMessage());
                sendJson(exchange, 500, "{\"error\":\"Unable to create account\"}");
            }
        }
    }

    /**
     * When loading the page for the cafeteria menu, use a call to list the entire menu
     * @param exchange
     * @throws IOException
     */
    private static void handleMenu(HttpExchange exchange) throws IOException {
        if (!requirePost(exchange, "/api/menu")) {
            return;
        }
        Map<String, String> form = readForm(exchange);
        //https://stackoverflow.com/questions/530012/how-to-convert-java-util-date-to-java-sql-date
        java.util.Date utilDate = new java.util.Date();
        java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());

        try (Connection conn = connect()) {
            getMenuFromDate(conn, sqlDate);
            sendJson(exchange, 201, "{\"message\":\"Menu from this date retrieved\"}");
        } catch (SQLException e) {
            if (e.getSQLState() != null && e.getSQLState().startsWith("23")) {
                sendJson(exchange, 409, "{\"error\":\"Conflict in database information\"}");
            } else {
                System.err.println("Menu request failed: " + e.getMessage());
                sendJson(exchange, 500, "{\"error\":\"Unable to get menu from this date\"}");
            }
        }
    }

    private static boolean requirePost(HttpExchange exchange, String expectedPath) throws IOException {
        if (!expectedPath.equals(exchange.getRequestURI().getPath())) {
            sendJson(exchange, 404, "{\"error\":\"Not found\"}");
            return false;
        }
        if (!"POST".equals(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Allow", "POST");
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return false;
        }
        return true;
    }

    private static Map<String, String> readForm(HttpExchange exchange) throws IOException {
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int count;
        try (InputStream input = exchange.getRequestBody()) {
            while ((count = input.read(buffer)) != -1) {
                body.write(buffer, 0, count);
            }
        }

        Map<String, String> form = new HashMap<>();
        String encodedForm = new String(body.toByteArray(), StandardCharsets.UTF_8);
        for (String pair : encodedForm.split("&")) {
            if (pair.isEmpty()) {
                continue;
            }
            String[] parts = pair.split("=", 2);
            String key = URLDecoder.decode(parts[0], StandardCharsets.UTF_8.name());
            String value = parts.length == 2
                    ? URLDecoder.decode(parts[1], StandardCharsets.UTF_8.name())
                    : "";
            form.put(key, value);
        }
        return form;
    }

    private static void handleFrontend(HttpExchange exchange) throws IOException {
        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        Path root = Paths.get(FRONTEND_DIR).toAbsolutePath().normalize();
        String requestedPath = exchange.getRequestURI().getPath();
        String relativePath = "/".equals(requestedPath) ? "menu.html" : requestedPath.substring(1);
        Path file = root.resolve(relativePath).normalize();
        if (!file.startsWith(root) || !Files.isRegularFile(file)) {
            sendJson(exchange, 404, "{\"error\":\"Not found\"}");
            return;
        }

        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        exchange.getResponseHeaders().set("Content-Type", contentType);
        byte[] content = Files.readAllBytes(file);
        exchange.sendResponseHeaders(200, content.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(content);
        }
    }

    private static void sendJson(HttpExchange exchange, int status, String body) throws IOException {
        byte[] content = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, content.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(content);
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
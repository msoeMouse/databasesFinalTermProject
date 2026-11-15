# Cafeteria Review Application
This application simulates an application to leave reviews on menu items in a cafeteria.
The database stores these menu items and the reviews. The backend sends user information
to the database. The frontend is an interface to get user information.

## Setting Up The Database and Application
You need a running MySQL server, MySQL Workbench, and a JDK. The frontend and
backend are served from the same Java server, so the browser can call the API
without separate CORS configuration.

1. In MySQL Workbench, run `database/finalProjectSetup.sql`, then
   `database/sample_data.sql`.
2. From PowerShell at the repository root, set the database password for the
   current terminal (replace the value with your MySQL password):

   ```powershell
   $env:DB_PASSWORD = "your-mysql-password"
   ```

   Optionally set `DB_HOST`, `DB_PORT`, `DB_NAME`, and `DB_USER`. Defaults are
   `localhost`, `3306`, `cafeteriareviewdb`, and `root`.
3. Compile the backend from the repository root:

   ```powershell
   javac -cp ".;mysql-connector-j-8.4.0.jar" -d out backend\ReviewApp.java
   ```
4. Start the server in the same terminal:

   ```powershell
   java -cp "out;mysql-connector-j-8.4.0.jar" backend.ReviewApp
   ```

5. Open <http://localhost:8080/>. The Java server serves the login page and
   handles `POST /api/login` and `POST /api/signup`. Stop it with Ctrl+C.

`HTTP_PORT` can override port 8080, and `FRONTEND_DIR` can override the
`frontend` directory. The MySQL Connector/J jar in the repository is the JDBC
driver required to connect to MySQL.

If you need to reset the database, running `finalProjectSetup.sql` again drops
and recreates its tables, so it deletes existing data.
If you already created the tables and need to preserve their data, add the
unique email index once in Workbench instead:

```sql
ALTER TABLE Account ADD UNIQUE INDEX accountEmail_UNIQUE (email);
```

This is a local class-project example, not production authentication: passwords
are currently stored as plain text in the existing schema, and the returned
account ID in browser storage is not a secure login session. Use password
hashing, HTTPS, and server-managed sessions before deploying it.

## Testing the Application
1. To run the tests in the /tests directory, [TODO]
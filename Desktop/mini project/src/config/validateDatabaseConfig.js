const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];

module.exports = function validateDatabaseConfig() {
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (process.env.DB_PASSWORD === 'YOUR_ACTUAL_MYSQL_PASSWORD') {
    missing.push('DB_PASSWORD (replace the example value)');
  }

  if (missing.length > 0) {
    throw new Error(
      `Database configuration is incomplete (${missing.join(', ')}). ` +
      'Copy .env.example to .env and set the database name, username, and actual password.'
    );
  }
};

import sql from 'mssql';

/** Database configuration. */
export const config = {
	user: process.env.DB_USER || 'sa',
	password: process.env.DB_PASSWORD || '',
	server: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT) || 1433,
	database: process.env.DB_NAME || 'NtunhsAtm',
	trustServerCertificate: true,
};

/**
 * Connects to database and returns a connection pool.
 *
 * @returns {sql.ConnectionPool | Promise}
 */
export const connect = async () => {
	return new sql.ConnectionPool(config).connect();
};

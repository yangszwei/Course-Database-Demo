/**
 * @file Database queries for system user model.
 * @author Si-Wei Yang
 */

import sql from 'mssql';

/**
 * Creates a new system user in database.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {SystemUserDto} user - User object.
 * @returns {Promise<SystemUser['id']>} Inserted user id.
 */
export async function createUser(db, user) {
	/** @type {SystemUserRecord} */
	const record = await db
		.request()
		.input('UserName', sql.VarChar(50), user.username)
		.input('Name', sql.NVarChar(100), user.name)
		.input('Password', sql.VarChar, user.password)
		.query(
			`INSERT INTO [SystemUser] (UserName, Name, Password)
			OUTPUT INSERTED.ID
			VALUES (@UserName, @Name, HASHBYTES('SHA2_512', @Password))`
		)
		.then(({ recordset }) => recordset[0]);

	return record.ID;
}

/**
 * Authenticates a system user in database with the login credentials.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {SystemUserLoginDto} login - Login credentials.
 * @returns {Promise<SystemUser | null>} User object if authenticated, null otherwise.
 */
export async function authenticateUser(db, login) {
	/** @type {SystemUserRecord | null} */
	const record = await db
		.request()
		.input('UserName', sql.VarChar(50), login.username)
		.input('Password', sql.VarChar, login.password)
		.query(
			`SELECT ID, UserName, Name
			FROM [SystemUser]
			WHERE UserName = @UserName AND Password = HASHBYTES('SHA2_512', @Password)`
		)
		.then(({ recordset }) => recordset[0] ?? null);

	if (!record) return null;

	return {
		id: record.ID,
		username: record.UserName,
		name: record.Name,
	};
}

/**
 * Gets a system user from database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {SystemUser['id']} id - User id.
 * @returns {Promise<SystemUser | null>} User object.
 */
export async function getUserById(db, id) {
	/** @type {SystemUserRecord | null} */
	const record = await db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`SELECT ID, UserName, Name, DeletedAt
			FROM [SystemUser]
			WHERE ID = @ID AND DeletedAt IS NULL`
		)
		.then(({ recordset }) => (recordset ? recordset[0] : null));

	if (!record) return null;

	return {
		id: record.ID,
		username: record.UserName,
		name: record.Name,
	};
}

/**
 * Gets a system user from database by its username.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {SystemUser['username']} username - User username.
 * @returns {Promise<SystemUser | null>} User object.
 */
export async function getUserByUserName(db, username) {
	/** @type {SystemUserRecord | null} */
	const record = await db
		.request()
		.input('UserName', sql.VarChar(50), username)
		.query(
			`SELECT ID, UserName, Name, DeletedAt
			FROM [SystemUser]
			WHERE UserName = @UserName AND DeletedAt IS NULL`
		)
		.then(({ recordset }) => (recordset ? recordset[0] : null));

	if (!record) return null;

	return {
		id: record.ID,
		username: record.UserName,
		name: record.Name,
	};
}

/**
 * Marks a system user as deleted in database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {SystemUser['id']} id - User id.
 * @returns {Promise<boolean>} Whether the user is deleted.
 */
export function deleteUserById(db, id) {
	return db
		.request()
		.input('ID', sql.Int, id)
		.query(`UPDATE [SystemUser] SET DeletedAt = GETDATE() WHERE ID = @ID`)
		.then(({ rowsAffected }) => rowsAffected[0] > 0);
}

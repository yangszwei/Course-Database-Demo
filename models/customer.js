/**
 * @file Database queries for customer model.
 * @author Si-Wei Yang
 */

import sql from 'mssql';

/**
 * Creates a new customer in database.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {CustomerDto} customer - Customer object.
 * @returns {Promise<Customer['id']>} Inserted customer id.
 */
export async function createCustomer(db, customer) {
	/** @type {{ ID: Customer['id'] }} */
	const record = await db
		.request()
		.input('UserName', sql.VarChar(50), customer.username)
		.input('FirstName', sql.NVarChar(50), customer.firstName)
		.input('LastName', sql.NVarChar(50), customer.lastName)
		.input('BirthDate', sql.Date, customer.birthDate)
		.input('Country', sql.NVarChar(50), customer.country)
		.input('City', sql.NVarChar(50), customer.city)
		.input('Address', sql.NVarChar(255), customer.address)
		.input('Password', sql.VarChar, customer.password)
		.input('UpdatedBy', sql.Int, customer.updatedBy)
		.query(
			`INSERT INTO [Customer] (UserName, FirstName, LastName, BirthDate, Country, City, Address, Password, UpdatedBy)
       OUTPUT INSERTED.ID
       VALUES (@UserName, @FirstName, @LastName, @BirthDate, @Country, @City, @Address,
               HASHBYTES('SHA2_512', @Password), @UpdatedBy)`
		)
		.then(({ recordset }) => recordset[0]);

	return record.ID;
}

/**
 * Authenticates a customer in database with the login credentials.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {CustomerLoginDto} login - Login credentials.
 * @returns {Promise<CustomerProfile | null>} Customer profile object if authenticated, null
 *   otherwise.
 */
export async function authenticateCustomer(db, login) {
	/** @type {CustomerResult | null} */
	const record = await db
		.request()
		.input('UserName', sql.VarChar(50), login.username)
		.input('Password', sql.VarChar, login.password)
		.query(
			`SELECT Customer.ID, Customer.UserName, Customer.FirstName, Customer.LastName
       FROM [Customer]
       WHERE Customer.UserName = @UserName
         AND Customer.Password = HASHBYTES('SHA2_512', @Password)
         AND Customer.DeletedAt IS NULL`
		)
		.then(({ recordset }) => recordset[0] ?? null);

	if (!record) return null;

	return {
		id: record.ID,
		username: record.UserName,
		firstName: record.FirstName,
		lastName: record.LastName,
	};
}

/**
 * Gets a customer from database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {Customer['id']} id - Customer id.
 * @returns {Promise<Customer | null>} Customer object.
 */
export async function getCustomerById(db, id) {
	/** @type {CustomerResult | null} */
	const record = await db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`SELECT Customer.ID,
              Customer.UserName,
              Customer.FirstName,
              Customer.LastName,
              Customer.BirthDate,
              Customer.Country,
              Customer.City,
              Customer.Address,
              Customer.UpdatedAt,
              Customer.UpdatedBy,
              SystemUser.Name     AS UpdatedByName,
              SystemUser.UserName AS UpdatedByUserName,
              Customer.DeletedAt
       FROM [Customer]
                JOIN [SystemUser] ON [Customer].UpdatedBy = [SystemUser].ID
       WHERE Customer.ID = @ID
         AND Customer.DeletedAt IS NULL`
		)
		.then(({ recordset }) => recordset[0] ?? null);

	if (!record) return null;

	return {
		id: record.ID,
		username: record.UserName,
		firstName: record.FirstName,
		lastName: record.LastName,
		birthDate: record.BirthDate,
		country: record.Country,
		city: record.City,
		address: record.Address,
		updatedAt: record.UpdatedAt,
		updatedBy: {
			id: record.UpdatedBy,
			username: record.UpdatedByUserName,
			name: record.UpdatedByName,
		},
		deletedAt: null,
	};
}

/**
 * Marks a customer as deleted in database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {Customer['id']} id - Customer id.
 * @returns {Promise<boolean>}
 */
export function deleteCustomerById(db, id) {
	return db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`UPDATE [Customer]
       SET DeletedAt = GETDATE()
       WHERE ID = @ID`
		)
		.then(({ rowsAffected }) => rowsAffected[0] > 0);
}

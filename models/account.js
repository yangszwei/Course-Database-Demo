/**
 * @file Database queries for account model.
 * @author Si-Wei Yang
 */

import { getCustomerById } from './customer.js';
import sql from 'mssql';

/**
 * Creates a new account in database.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {AccountDto} account - Account object.
 * @returns {Promise<Account['id']>} Inserted account id.
 */
export async function createAccount(db, account) {
	/** @type {{ ID: Account['id'] }} */
	const record = await db
		.request()
		.input('AccountID', sql.VarChar(10), account.accountId)
		.input('CustomerID', sql.Int, account.customerId)
		.input('BranchID', sql.Int, account.branchId)
		.input('Type', sql.NChar(4), account.type)
		.input('Balance', sql.Decimal(10, 2), account.balance)
		.input('UpdatedBy', sql.Int, account.updatedBy)
		.query(
			`INSERT INTO [Account] (AccountID, CustomerID, BranchID, Type, Balance, UpdatedBy)
			OUTPUT INSERTED.ID
			VALUES (@AccountID, @CustomerID, @BranchID, @Type, @Balance, @UpdatedBy)`
		)
		.then(({ recordset }) => recordset[0]);

	return record.ID;
}

/**
 * Gets an account from database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {Account['id']} id - Account id.
 * @returns {Promise<Account | null>} Account object.
 */
export async function getAccountById(db, id) {
	/** @type {AccountResult | null} */
	const result = await db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`SELECT
				Account.ID, Account.AccountID, Account.CustomerID, Account.BranchID,
				Account.Type, Account.Balance, Account.UpdatedAt, Account.UpdatedBy,
				SystemUser.Name AS UpdatedByName, SystemUser.UserName AS UpdatedByUserName,
				Account.DeletedAt
			FROM [Account]
			JOIN [SystemUser] ON [Account].UpdatedBy = [SystemUser].ID
			WHERE Account.ID = @ID AND Account.DeletedAt IS NULL`
		)
		.then(({ recordset }) => recordset[0] ?? null);

	if (!result) return null;

	return {
		id: result.ID,
		accountId: result.AccountID,
		customer: await getCustomerById(db, result.CustomerID),
		branchId: result.BranchID,
		type: result.Type,
		balance: result.Balance,
		updatedAt: result.UpdatedAt,
		updatedBy: {
			id: result.UpdatedBy,
			name: result.UpdatedByName,
			username: result.UpdatedByUserName,
		},
		deletedAt: null,
	};
}

/**
 * Gets accounts from database by its customer id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {Customer['id']} customerId - Customer id.
 * @returns {Promise<Account[]>} Account objects.
 */
export function getAccountsByCustomerId(db, customerId) {
	return db
		.request()
		.input('CustomerID', sql.Int, customerId)
		.query(
			`SELECT
				Account.ID, Account.AccountID, Account.CustomerID, Account.BranchID,
				Account.Type, Account.Balance, Account.UpdatedAt, Account.UpdatedBy,
				SystemUser.Name AS UpdatedByName, SystemUser.UserName AS UpdatedByUserName,
				Account.DeletedAt
			FROM [Account]
			JOIN [SystemUser] ON [Account].UpdatedBy = [SystemUser].ID
			WHERE Account.CustomerID = @CustomerID AND Account.DeletedAt IS NULL`
		)
		.then(({ recordset }) =>
			Promise.all(
				recordset.map(async (result) => ({
					id: result.ID,
					accountId: result.AccountID,
					customer: await getCustomerById(db, result.CustomerID),
					branchId: result.BranchID,
					type: result.Type,
					balance: result.Balance,
					updatedAt: result.UpdatedAt,
					updatedBy: {
						id: result.UpdatedBy,
						name: result.UpdatedByName,
						username: result.UpdatedByUserName,
					},
					deletedAt: null,
				}))
			)
		);
}

/**
 * Deletes an account from database by its id.
 *
 * @param {sql.ConnectionPool | Promise} db - Database connection pool.
 * @param {Account['id']} id - Account id.
 * @returns {Promise<boolean>} Whether the account is deleted.
 */
export function deleteAccountById(db, id) {
	return db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`UPDATE [Account]
			SET DeletedAt = CURRENT_TIMESTAMP
			WHERE ID = @ID AND DeletedAt IS NULL`
		)
		.then(({ rowsAffected }) => rowsAffected[0] > 0);
}

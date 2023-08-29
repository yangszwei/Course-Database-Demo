/**
 * @file Database queries for transaction model.
 * @author Si-Wei Yang
 */

import sql from 'mssql';
import { getAccountById } from './account.js';
import { getUserById } from './user.js';

/**
 * Creates a new transaction in database.
 *
 * @param {sql.ConnectionPool} db - Database connection.
 * @param {TransactionDto} transaction - Transaction object.
 * @returns {Promise<Transaction['id']>} - Transaction id.
 */
export async function createTransaction(db, transaction) {
	const request = new sql.Request(db);
	request.input('AccountID', sql.Int, transaction.accountId);
	request.input('AtmID', sql.Int, transaction.atmId);
	request.input('Type', sql.NChar(2), transaction.type);
	request.input('Content', sql.NVarChar(255), transaction.content);
	request.input('Amount', sql.Decimal(10, 2), transaction.amount);

	let updatedBy = 'NULL';
	if (transaction.updatedBy != null) {
		request.input('UpdatedBy', sql.Int, transaction.updatedBy);
		updatedBy = '@UpdatedBy';
	}

	const command = `INSERT INTO [Transaction] (AccountID, AtmID, Type, Content, Amount, IssuedAt, UpdatedBy)
    		OUTPUT INSERTED.ID
				VALUES (@AccountID, @AtmID, @Type, @Content, @Amount, GETDATE(), ${updatedBy});`;

	/** @type {{ ID: Transaction['id'] }} */
	const record = await request.query(command).then(({ recordset }) => recordset[0]);

	return record.ID;
}

/**
 * Gets a transaction from database by its id.
 *
 * @param {sql.ConnectionPool} db - Database connection.
 * @param {Transaction['id']} id - Transaction id.
 * @returns {Promise<Transaction | null>} - Transaction object.
 */
export async function getTransactionById(db, id) {
	/** @type {TransactionRecord} */
	const record = await db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`SELECT ID,
              AccountID,
              AtmID,
              Type,
              Content,
              Amount,
              IssuedAt,
              UpdatedAt,
              UpdatedBy
			FROM [Transaction]
			WHERE ID = @ID`
		)
		.then(({ recordset }) => recordset[0] ?? null);

	if (!record) return null;

	return {
		id: record.ID,
		account: await getAccountById(db, record.AccountID),
		atmId: record.AtmID,
		type: record.Type,
		content: record.Content,
		amount: record.Amount,
		issuedAt: record.IssuedAt,
		updatedAt: record.UpdatedAt,
		updatedBy: await getUserById(db, record.UpdatedBy),
	};
}

/**
 * Gets an array of transactions from database by filter.
 *
 * @param {sql.ConnectionPool} db - Database connection.
 * @param {TransactionFilter} filter - Transaction filter.
 * @returns {Promise<Transaction[]>} - Array of transaction objects.
 */
export async function getTransactions(db, filter) {
	const request = new sql.Request(db);
	if (filter.accountId != null) {
		request.input('AccountID', sql.Int, filter.accountId);
	}

	let command = 'SELECT * FROM [Transaction]';
	if (filter.accountId != null) {
		command += ' WHERE AccountID = @AccountID';
	}

	const { recordset } = await request.query(command);
	if (!recordset) return [];

	return Promise.all(
		recordset.map(async (record) => ({
			id: record.ID,
			account: await getAccountById(db, record.AccountID),
			atmId: record.AtmID,
			type: record.Type,
			content: record.Content,
			amount: record.Amount,
			issuedAt: record.IssuedAt,
			updatedAt: record.UpdatedAt,
			updatedBy: await getUserById(db, record.UpdatedBy),
		}))
	);
}

/**
 * Updates a transaction in database by its id.
 *
 * @param {sql.ConnectionPool} db - Database connection.
 * @param {Transaction['id']} id - Transaction id.
 * @param {TransactionDto} transaction - Transaction object.
 * @returns {Promise<boolean>} - Whether the transaction is updated.
 */
export function updateTransactionById(db, id, transaction) {
	return db
		.request()
		.input('ID', sql.Int, id)
		.input('AccountID', sql.Int, transaction.accountId)
		.input('AtmID', sql.Int, transaction.atmId)
		.input('Type', sql.NChar(2), transaction.type)
		.input('Content', sql.NVarChar(255), transaction.content)
		.input('Amount', sql.Decimal(10, 2), transaction.amount)
		.input('UpdatedBy', sql.Int, transaction.updatedBy)
		.query(
			`UPDATE [Transaction]
						SET AccountID = @AccountID,
								AtmID = @AtmID,
								Type = @Type,
								Content = @Content,
								Amount = @Amount,
								UpdatedAt = GETDATE(),
								UpdatedBy = @UpdatedBy
						WHERE ID = @ID`
		)
		.then(({ rowsAffected }) => rowsAffected[0] > 0);
}

/**
 * Deletes a transaction from database by its id.
 *
 * @param {sql.ConnectionPool} db - Database connection.
 * @param {Transaction['id']} id - Transaction id.
 * @returns {Promise<boolean>} - Whether the transaction is deleted.
 */
export function deleteTransactionById(db, id) {
	return db
		.request()
		.input('ID', sql.Int, id)
		.query(
			`DELETE
            FROM [Transaction]
            WHERE ID = @ID`
		)
		.then(({ rowsAffected }) => rowsAffected[0] > 0);
}

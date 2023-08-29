/**
 * @file Tests for transaction database queries.
 * @author Si-Wei Yang
 */

import 'dotenv/config';
import { connect } from '../utils/database.js';
import { createAccount } from './account.js';
import { createCustomer } from './customer.js';
import { createUser } from './user.js';
import * as db from './transaction.js';
import { expect } from 'chai';

const pool = await connect();

describe('Transaction model', () => {
	let userId, customerId, accountId, transactionId;

	const user = {
		username: 'transaction_admin',
		name: 'Admin',
		password: 'password',
	};

	const customer = {
		username: 'test_transaction',
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date(),
		country: 'Test country',
		city: 'Test city',
		address: 'Test address',
		password: 'password',
	};

	const account = {
		accountId: '0987654321',
		branchId: 1,
		type: '定期存款',
		balance: 1000,
	};

	const transaction = {
		atmId: 1,
		type: '存款',
		content: 'Test transaction',
		amount: 100,
	};

	before(async () => {
		userId = await createUser(pool, user);
		if (!userId) {
			throw new Error('Failed to create user');
		}

		customerId = await createCustomer(pool, { ...customer, updatedBy: userId });
		if (!customerId) {
			throw new Error('Failed to create customer');
		}

		accountId = await createAccount(pool, { ...account, customerId, updatedBy: userId });
		if (!accountId) {
			throw new Error('Failed to create account');
		}

		transaction.accountId = accountId;
	});

	it('should create a new transaction', async () => {
		transactionId = await db.createTransaction(pool, {
			...transaction,
			accountId,
			updatedBy: userId,
		});

		expect(transactionId).to.be.a('number');
	});

	it('should get a transaction by its id', async () => {
		const result = await db.getTransactionById(pool, transactionId);

		expect(result).to.be.an('object');
	});

	it('should get all transactions of an account', async () => {
		const result = await db.getTransactions(pool, { accountId });

		expect(result).to.be.an('array');
	});

	it('should not get transaction of an account', async () => {
		const result = await db.getTransactions(pool, { accountId: 0 });

		expect(result).to.be.an('array').that.is.empty;
	});

	it('should update a transaction by its id', async () => {
		const ok = await db.updateTransactionById(pool, transactionId, {
			...transaction,
			amount: 200,
			updatedBy: userId,
		});
		expect(ok).to.be.true;

		const result = await db.getTransactionById(pool, transactionId);
		expect(result.amount).to.equal(200);
	});

	it('should delete a transaction by its id', async () => {
		const ok = await db.deleteTransactionById(pool, transactionId);
		expect(ok).to.be.true;

		expect(await db.getTransactionById(pool, transactionId)).to.be.null;
	});

	after(async () => {
		await pool.query(`DELETE FROM [Transaction] WHERE ID = ${transactionId}`);
		await pool.query(`DELETE FROM [Account] WHERE ID = ${accountId}`);
		await pool.query(`DELETE FROM [Customer] WHERE ID = ${customerId}`);
		await pool.query(`DELETE FROM [SystemUser] WHERE ID = ${userId}`);
		await pool.close();
	});
});

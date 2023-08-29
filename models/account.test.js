/**
 * @file Tests for account database queries.
 * @author Si-Wei Yang
 */

import 'dotenv/config';
import { connect } from '../utils/database.js';
import { createCustomer } from './customer.js';
import { createUser } from './user.js';
import * as db from './account.js';
import { expect } from 'chai';

const pool = await connect();

describe('Account model', () => {
	let userId, customerId, accountId;

	const user = {
		username: 'account_admin',
		name: 'Admin',
		password: 'password',
	};

	const customer = {
		username: 'test_account',
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date('1990-01-01'),
		country: 'Test country',
		city: 'Test city',
		address: 'Test address',
		password: 'password',
	};

	const account = {
		accountId: '1234567890',
		branchId: 1,
		type: '活期存款',
		balance: 1000,
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
	});

	it('should create a new account', async () => {
		accountId = await db.createAccount(pool, { ...account, customerId, updatedBy: userId });

		expect(accountId).to.be.a('number');
	});

	it('should get an account by id', async () => {
		const account = await db.getAccountById(pool, accountId);

		expect(account).to.contain({
			id: accountId,
			accountId: account.accountId,
			branchId: account.branchId,
			type: account.type,
			balance: account.balance,
			deletedAt: null,
		});

		expect(account.customer).to.contain({
			id: customerId,
			username: customer.username,
			firstName: customer.firstName,
			lastName: customer.lastName,
			country: customer.country,
			city: customer.city,
			address: customer.address,
			deletedAt: null,
		});

		expect(account.updatedAt).to.be.a('date');

		expect(account.updatedBy).to.contain({
			id: userId,
			name: user.name,
			username: user.username,
		});
	});

	it('should get accounts by customer id', async () => {
		const accounts = await db.getAccountsByCustomerId(pool, customerId);

		expect(accounts).to.be.an('array').that.is.not.empty;

		console.log(accounts[0]);

		expect(accounts[0]).to.contain({
			id: accountId,
			accountId: account.accountId,
			branchId: account.branchId,
			type: account.type,
			balance: account.balance,
			deletedAt: null,
		});

		expect(accounts[0].customer).to.contain({
			id: customerId,
			username: customer.username,
			firstName: customer.firstName,
			lastName: customer.lastName,
			country: customer.country,
			city: customer.city,
			address: customer.address,
			deletedAt: null,
		});

		expect(accounts[0].updatedAt).to.be.a('date');

		expect(accounts[0].updatedBy).to.contain({
			id: userId,
			name: user.name,
			username: user.username,
		});
	});

	it('should delete an account by id', async () => {
		const ok = await db.deleteAccountById(pool, accountId);
		expect(ok).to.be.true;

		expect(await db.getAccountById(pool, accountId)).to.be.null;
	});

	after(async () => {
		await pool.query(`DELETE FROM [Account] WHERE ID = ${accountId}`);
		await pool.query(`DELETE FROM [Customer] WHERE ID = ${customerId}`);
		await pool.query(`DELETE FROM [SystemUser] WHERE ID = ${userId}`);
		await pool.close();
	});
});

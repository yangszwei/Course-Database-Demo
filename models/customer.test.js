/**
 * @file Tests for customer database queries.
 * @author Si-Wei Yang
 */

import 'dotenv/config';
import { connect } from '../utils/database.js';
import { createUser } from './user.js';
import * as db from './customer.js';
import { expect } from 'chai';

const pool = await connect();

describe('Customer model', () => {
	let userId, customerId;

	const user = {
		username: 'customer_admin',
		name: 'Admin',
		password: 'password',
	};

	const customer = {
		username: 'test_customer',
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date(),
		country: 'Test country',
		city: 'Test city',
		address: 'Test address',
		password: 'password',
	};

	before(async () => {
		userId = await createUser(pool, user);
		if (!userId) {
			throw new Error('Failed to create user');
		}
	});

	it('should create a new customer', async () => {
		customerId = await db.createCustomer(pool, { ...customer, updatedBy: userId });

		expect(customerId).to.be.a('number');
	});

	it('should authenticate a customer', async () => {
		const profile = await db.authenticateCustomer(pool, {
			username: customer.username,
			password: customer.password,
		});

		expect(profile).to.contain({
			id: customerId,
			username: customer.username,
			firstName: customer.firstName,
			lastName: customer.lastName,
		});
	});

	it('should not authenticate a customer with wrong password', async () => {
		const profile = await db.authenticateCustomer(pool, {
			username: customer.username,
			password: 'wrong_password',
		});

		expect(profile).to.be.null;
	});

	it('should get a customer by id', async () => {
		const customer = await db.getCustomerById(pool, customerId);

		expect(customer).to.contain({
			id: customerId,
			username: customer.username,
			firstName: customer.firstName,
			lastName: customer.lastName,
			birthDate: customer.birthDate,
			country: customer.country,
			city: customer.city,
			address: customer.address,
			deletedAt: null,
		});

		expect(customer.updatedAt).to.be.a('date');

		expect(customer.updatedBy).to.contain({
			id: userId,
			name: user.name,
			username: user.username,
		});
	});

	it('should delete a customer by id', async () => {
		const ok = await db.deleteCustomerById(pool, customerId);
		expect(ok).to.be.true;

		expect(await db.getCustomerById(pool, customerId)).to.be.null;
	});

	after(async () => {
		await pool.query(`DELETE FROM [Customer] WHERE ID = ${customerId}`);
		await pool.query(`DELETE FROM [SystemUser] WHERE ID = ${userId}`);
		await pool.close();
	});
});

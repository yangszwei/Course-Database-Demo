/**
 * @file Tests for system user database queries.
 * @author Si-Wei Yang
 */

import 'dotenv/config';
import { connect } from '../utils/database.js';
import * as db from './user.js';
import { expect } from 'chai';

const pool = await connect();

describe('System User model', () => {
	let userId;

	const user = {
		username: 'test',
		name: 'Test',
		password: 'test',
	};

	after(async () => {
		await pool.query(`DELETE FROM [SystemUser] WHERE ID = ${userId}`);
		await pool.close();
	});

	it('should create a new user', async () => {
		userId = await db.createUser(pool, user);

		expect(userId).to.be.a('number');
	});

	it('should authenticate a user', async () => {
		expect(await db.authenticateUser(pool, user)).to.contain({
			id: userId,
			username: user.username,
			name: user.name,
		});
	});

	it('should not authenticate a user', async () => {
		const result = await db.authenticateUser(pool, {
			username: user.username,
			password: 'wrong',
		});

		expect(result).to.be.null;
	});

	it('should get a user by id', async () => {
		const result = await db.getUserById(pool, userId);

		expect(result).to.contain({
			id: userId,
			username: user.username,
			name: user.name,
		});
	});

	it('should get a user by username', async () => {
		const result = await db.getUserByUserName(pool, user.username);

		expect(result).to.contain({
			id: userId,
			username: user.username,
			name: user.name,
		});
	});

	it('should delete a user by id', async () => {
		const ok = await db.deleteUserById(pool, userId);
		expect(ok).to.be.true;

		expect(await db.getUserById(pool, userId)).to.be.null;
	});
});

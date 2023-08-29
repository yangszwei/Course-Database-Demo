/**
 * @file API handlers for Account endpoints.
 * @author Si-Wei Yang
 */

import * as db from '../models/account.js';
import sql from 'mssql';

/** @type {import('@koa/router').Middleware} */
export const createAccount = async (ctx) => {
	const account = {
		...ctx.request.body,
		updatedBy: ctx.session.user.id,
	};

	try {
		const id = await db.createAccount(ctx.db, account);
		ctx.body = { id };
		ctx.status = 201;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getAccountById = async (ctx) => {
	try {
		const account = await db.getAccountById(ctx.db, ctx.params.id);
		if (account == null) {
			ctx.status = 404;
			return;
		}

		ctx.body = account;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getCustomerAccounts = async (ctx) => {
	try {
		const customer = ctx.session.customer;
		ctx.body = await db.getAccountsByCustomerId(ctx.db, customer.id);
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getAccountsByCustomerId = async (ctx) => {
	try {
		ctx.body = await db.getAccountsByCustomerId(ctx.db, ctx.params.id);
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const deleteAccountById = async (ctx) => {
	try {
		await db.deleteAccountById(ctx.db, ctx.params.id);
		ctx.status = 204;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};
